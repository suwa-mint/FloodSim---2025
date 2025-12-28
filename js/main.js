// 1. CAU HINH
const CONFIG = {
    vietnamBounds: [[6, 80], [25, 200]],
    mapCenter: [16.0, 106.0],
    zoom: 6,
};

// Bien toan cuc
let map;
let damLayers = { 
    large: L.layerGroup(), 
    medium: L.layerGroup(), 
    reservoir: L.layerGroup() 
};
let damStates = { large: false, medium: false, reservoir: false };
let dangerLayer = L.layerGroup();
let isDangerLayerVisible = false;
let currentMarker = null;
let simulationLayer = L.layerGroup(); // Layer hiển thị vùng ngập

// 2. LOGIC TINH TOAN

// Tinh khoang cach 2 diem (km)
function Haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    return Math.round(R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))) * 1000) / 1000;
}

// Tim 3 dap gan nhat
function threeNearest(lat1, lon1) {
    if (typeof listdap === 'undefined') return [];
    const distances = listdap.map(dap => ({
        ...dap,
        distance: Haversine(lat1, lon1, dap.lat, dap.lng)
    }));
    distances.sort((a, b) => a.distance - b.distance);
    return distances.slice(0, 3);
}

// Tinh nguong an toan dua theo do cao
function limitSafe(h) {
    const maxH = 200;
    const safeH = h > 0 ? h : 10; 
    return Math.round((safeH / maxH) * 5000); 
}

// KHOI TAO MAP VA API
function initializeMap() {
    // Khoi tao map
    map = L.map("map", {
        center: CONFIG.mapCenter,
        zoom: CONFIG.zoom,
        maxBounds: L.latLngBounds(CONFIG.vietnamBounds),
        minZoom: 6,
    });

    // Lop nen OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; FloodSim Team 2025',
        maxZoom: 20, noWrap: true, bounds: CONFIG.vietnamBounds,
    }).addTo(map);

    simulationLayer.addTo(map); // Thêm layer vùng ngập vào bản đồ

    // Su kien CLICK ban do (Quan trong)
    map.on('click', async function (e) {
        if (currentMarker) {
            map.removeLayer(currentMarker);
            currentMarker = null;
            simulationLayer.clearLayers(); // Xóa vùng ngập khi click lại
            return;
        }

        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Popup loading
        L.popup()
            .setLatLng(e.latlng)
            .setContent('<div style="text-align:center; padding:10px;"><i class="fas fa-spinner fa-spin"></i> Đang phân tích...</div>')
            .openOn(map);

        // Goi API Open-Meteo
        let doCao = 15; 
        let luuLuongMua = 0;
        
        try {
            const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=rain,showers&timezone=auto`;
            const eUrl = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`;

            const [wRes, eRes] = await Promise.all([fetch(wUrl), fetch(eUrl)]);
            const wData = await wRes.json();
            const eData = await eRes.json();

            if (eData.elevation) doCao = Math.round(eData.elevation[0]);
            if (wData.current) luuLuongMua = (wData.current.rain || 0) + (wData.current.showers || 0);
        } catch (err) {
            console.warn("Lỗi API, dùng data mặc định");
        }

        // Xu ly Logic
        const nguong = limitSafe(doCao);
        const nearestDams = threeNearest(lat, lng);

        // Check vung nguy hiem (tu file data.js)
        let isDangerous = false;
        let detectedLocation = "Vùng lân cận";
        const checkRadius = 50000; // 50km

        const areas = (typeof dangerCoords !== 'undefined') ? Object.keys(dangerCoords) : [];
        for (const area of areas) {
            if (map.distance([lat, lng], dangerCoords[area]) <= checkRadius) {
                detectedLocation = area;
                isDangerous = true;
                break;
            }
        }

        // Tao HTML Popup (class theo layout.css)
        let statusHtml = isDangerous 
            ? `<div class="popup-danger">⚠️ Vùng Nguy Hiểm (${detectedLocation})</div>` 
            : `<div class="popup-safe">✅ Khu vực An Toàn</div>`;

        let options = nearestDams.map((d, i) => 
            `<option value="${d.id}" ${i===0?'selected':''}>${d.ten} (${d.distance}km)</option>`
        ).join('');

        const popupHTML = `
            <div class="info-panel" style="min-width:280px;">
                <h3 class="popup-header">Phân Tích Thủy Văn</h3>
                <div class="popup-location">${statusHtml}</div>
                
                <div class="popup-section">
                    <label class="popup-label">Nguồn xả lũ giả định:</label>
                    <select id="selectDap" class="popup-input" style="border:1px solid #ddd;">${options}</select>
                </div>

                <div class="popup-grid">
                    <div class="popup-grid-item height">⛰️ Cao: <b>${doCao}m</b></div>
                    <div class="popup-grid-item rain">🌧️ Mưa: <b>${luuLuongMua.toFixed(1)}mm</b></div>
                    <div class="popup-grid-item threshold">🛡️ Ngưỡng: <b class="text-green">${nguong.toLocaleString()}</b></div>
                </div>

                <div class="popup-sim-box">
                    <div style="display:flex; gap:5px; align-items: center;">
                        <input type="number" id="inpXa" value="${nguong + 500}" style="width:80px; padding:5px;">
                        <button class="sim-btn" onclick="chaySim(${doCao})">MÔ PHỎNG</button>
                    </div>
                </div>
            </div>
        `;

        currentMarker = L.marker([lat, lng]).addTo(map).bindPopup(popupHTML).openPopup();
    });
}

// 4. GIAO DEIN VA TIEN ICH

// Ve cac cham tron dai dien cho dap
function initializeDams() {
    if (typeof listdap === 'undefined') return;
    listdap.forEach(dap => {
        let color = '#0066ff', targetLayer = damLayers.reservoir;
        if (dap.dung_tich >= 1000) { color = '#33ebff'; targetLayer = damLayers.large; }
        else if (dap.dung_tich >= 100) { color = '#ff9900'; targetLayer = damLayers.medium; }

        L.circleMarker([dap.lat, dap.lng], {
            radius: 8, fillColor: color, color: "#fff", weight: 2, fillOpacity: 0.9
        }).bindPopup(`
            <img src="${dap.anh}" class="dam-popup-image" onclick="openDamDetail('${dap.id}')" onerror="this.style.display='none'">
            <div style="text-align:center;">
                <div style="color:#0066ff; font-weight:bold;">${dap.ten}</div>
                <div style="font-size:12px;">Dung tích: ${dap.dung_tich} triệu m³</div>
            </div>
        `).addTo(targetLayer);
    });
}

// Bat tat panel chu thich
function toggleLegendPanel() {
    const panel = document.getElementById("legendPanel");
    panel.classList.toggle("active");
    const btn = document.getElementById("legendToggle");
    btn.innerHTML = panel.classList.contains("active") 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-layer-group"></i> Hiện chú thích';
}

// Bat tat layer thuy dien
function toggleDamLayer(type, el) {
    if (damStates[type]) { map.removeLayer(damLayers[type]); el.style.background = ""; }
    else { map.addLayer(damLayers[type]); el.style.background = "#e0f7fa"; }
    damStates[type] = !damStates[type];
}

// Bat tat layer vung nguy hiem
function toggleDangerLayer(el) {
    if (isDangerLayerVisible) { map.removeLayer(dangerLayer); el.style.background = ""; }
    else {
        dangerLayer.clearLayers();
        if(typeof dangerCoords !== 'undefined'){
            Object.keys(dangerCoords).forEach(area => {
                L.circle(dangerCoords[area], { color: 'red', radius: 25000, fillOpacity: 0.2 })
                 .bindPopup(`<b>${area}</b><br>Khu vực rủi ro cao`).addTo(dangerLayer);
            });
        }
        map.addLayer(dangerLayer);
        el.style.background = "#ffebeb";
    }
    isDangerLayerVisible = !isDangerLayerVisible;
}

// Tim kiem
async function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    const resDiv = document.getElementById("searchResults");
    if (!query) { resDiv.style.display = "none"; return; }

    resDiv.innerHTML = '<div style="padding:15px;">Đang tìm...</div>';
    resDiv.style.display = "block";

    let html = "";
    // Tim trong data local
    const localRes = listdap.filter(d => 
        d.ten.toLowerCase().includes(query.toLowerCase()) || 
        d.song.toLowerCase().includes(query.toLowerCase())
    );
    localRes.forEach(d => {
        html += `<div class="search-result-item" onclick="flyTo(${d.lat}, ${d.lng}, '${d.ten}')">
                    <i class="fas fa-water"></i> <div><div class="result-title">${d.ten}</div><div style="font-size:12px">${d.song}</div></div>
                 </div>`;
    });

    // Tim qua API OSM
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=3`);
        const data = await res.json();
        data.forEach(d => {
            html += `<div class="search-result-item" onclick="flyTo(${d.lat}, ${d.lon}, '${d.display_name}')">
                        <i class="fas fa-map-marker-alt"></i> <div><div class="result-title">${d.display_name.split(',')[0]}</div></div>
                     </div>`;
        });
    } catch(e) {}

    resDiv.innerHTML = html || '<div style="padding:15px;">Không tìm thấy kết quả</div>';
}

function flyTo(lat, lng, name) {
    map.setView([lat, lng], 12);
    document.getElementById("searchResults").style.display = "none";
    document.getElementById("searchInput").value = name;
}
// thay logic tinh toan mo phong vao day xoá code cũ
function chaySim(doCao) {
    const val = document.getElementById('inpXa').value;
    alert(`MÔ PHỎNG:\nXả lũ: ${val} m³/s\nĐộ cao: ${doCao}m\n-> Đã gửi cảnh báo về trung tâm!`);


// Xu ly chi tiet dap & modal anh
function openDamDetail(id) {
    const d = listdap.find(x => x.id === id);
    if(d) {
        document.getElementById('damDetailPanel').style.display = 'block';
        document.getElementById('damDetailImage').src = d.anh;
        document.getElementById('damDetailTitle').innerText = d.ten;
        document.getElementById('damDetailInfo').innerHTML = `<p><strong>Sông:</strong> ${d.song}</p><p><strong>Dung tích:</strong> ${d.dung_tich} triệu m³</p><p><strong>Địa hình:</strong> ${d.terrain}</p>`;
    }
}
function closeDamDetail() { document.getElementById('damDetailPanel').style.display = 'none'; }
function openImageModal(src) { document.getElementById('imageModal').style.display = 'block'; document.getElementById('modalImg').src = src; }

// KHOI CHAY
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("legendToggle").addEventListener("click", toggleLegendPanel);
    initializeMap();
    initializeDams();
});