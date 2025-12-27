// 1. cau hinh co ban cho map
const CONFIG = {
    vietnamBounds: [[6, 80], [25, 200]],
    mapCenter: [16.0, 106.0],
    zoom: 6,
};

// bien toan cuc, dung de quan ly may cai layer vs marker
let map;
let legendVisible = false;
let damLayers = {
    large: L.layerGroup(),
    medium: L.layerGroup(),
    reservoir: L.layerGroup()
};
// trang thai bat tat layer
let damStates = { large: false, medium: false, reservoir: false };
let dangerLayer = L.layerGroup();
let isDangerLayerVisible = false;
let currentMarker = null;

// P2: logic tinh toan

// cong thuc tinh khoang cach giua 2 diem (haversine)
function Haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 1000) / 1000;
}

// loc ra 3 thang gan nhat de nhet vo cai select
function threeNearest(lat1, lon1) {
    // ko co data thi cook
    if (typeof listdap === 'undefined') return [];
    
    // map qua tung thang de tinh khoang cach
    const distances = listdap.map(dap => {
        return {
            ...dap,
            distance: Haversine(lat1, lon1, dap.lat, dap.lng)
        };
    });
    
    // sap xep tang dan
    distances.sort((a, b) => a.distance - b.distance);
    return distances.slice(0, 3);
}

// P3: giao dien map

// khoi tao map, load tile tu osm
function initializeMap() {
    map = L.map("map", {
        center: CONFIG.mapCenter,
        zoom: CONFIG.zoom,
        maxBounds: L.latLngBounds(CONFIG.vietnamBounds),
        maxZoom: 20,
        minZoom: 6,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap | FloodSim',
        maxZoom: 20, noWrap: true, bounds: CONFIG.vietnamBounds,
    }).addTo(map);

    // --- su kien click vao map, doan nay xu ly hoi nhieu ---
    map.on('click', async function (e) {
        // xoa cai marker cu di cho do roi
        if (currentMarker) {
            map.removeLayer(currentMarker);
            currentMarker = null;
            return;
        }

        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // hien cai popup loading gia bo trong luc doi api
        const loadingPopup = L.popup()
            .setLatLng(e.latlng)
            .setContent('<div style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu thời tiết...</div>')
            .openOn(map);

        // -- GOI API OPEN-METEO --
        let doCao = 0;
        let luuLuongMua = 0;
        let nguong = 2000; // mac dinh

        try {
            // api lay thoi tiet vs do cao
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=rain,showers&timezone=auto&forecast_days=1`;
            const elevationUrl = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`;

            // fetch 2 cai 1 luc cho le
            const [wRes, eRes] = await Promise.all([
                fetch(weatherUrl),
                fetch(elevationUrl)
            ]);

            const wData = await wRes.json();
            const eData = await eRes.json();

            // gan data vao bien
            if (eData.elevation) doCao = Math.round(eData.elevation[0]);
            if (wData.current) {
                luuLuongMua = (wData.current.rain || 0) + (wData.current.showers || 0);
            }

        } catch (err) {
            // lo ma api loi thi bao log thoi, dung de chet web
            console.error("Lỗi gọi API thời tiết:", err);
        }

        // -- CHECK VUNG NGUY HIEM --
        let detectedLocation = "Vùng lân cận";
        let isDangerous = false;
        const detectionRadius = 25000; // 25km

        // lay list tu data.js qua
        const areasToCheck = (typeof LIST_DANGER_AREAS !== 'undefined') ? LIST_DANGER_AREAS : Object.keys(dangerCoords);

        for (const area of areasToCheck) {
            if (dangerCoords[area]) {
                if (map.distance([lat, lng], dangerCoords[area]) <= detectionRadius) {
                    detectedLocation = area;
                    isDangerous = true;
                    break;
                }
            }
        }

        // render cai canh bao xanh do
        let htmlCanhBao = `<div class="popup-location">Vị trí: <b>${detectedLocation}</b></div>`;
        if (isDangerous) {
            htmlCanhBao += `<div style="color:red; font-weight:bold; margin-bottom:5px;">⚠️ Khu vực nguy hiểm cao</div>`;
        } else {
            htmlCanhBao += `<div style="color:green; font-weight:bold; margin-bottom:5px;">✅ Khu vực tương đối an toàn</div>`;
        }

        // -- TIM DAP GAN NHAT --
        const nearestDams = threeNearest(lat, lng);
        let options = nearestDams.map((d, index) =>
            `<option value="${d.id}" ${index === 0 ? 'selected' : ''}>${d.ten} (${d.distance.toFixed(1)}km)</option>`
        ).join('');

        // -- tao html cho popup, doan nay css ben style.css lo r --
        var popupHTML = `
            <div class="info-panel" style="min-width:280px">
                <h3 style="color:#0066ff; border-bottom:1px solid #ddd; margin:0 0 10px 0; padding-bottom:5px;">Phân Tích Đa Nguồn</h3>
                ${htmlCanhBao} 
                <div style="background:#f9f9f9; padding:10px; border-radius:5px; margin-bottom:10px;">
                    <label style="font-size:12px; font-weight:bold; color:#555">Nguồn xả lũ giả lập:</label>
                    <select id="selectDap" onchange="doiDap(this.value, ${doCao}, ${luuLuongMua})" style="width:100%; padding:5px; margin-top:5px; border:1px solid #ccc; border-radius:4px;">
                        ${options}
                    </select>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; font-size:12px;">
                    <div style="background:#fff; padding:5px; border:1px solid #eee; text-align:center;">⛰️ Độ cao: <b>${doCao}m</b></div>
                    <div style="background:#fff; padding:5px; border:1px solid #eee; text-align:center;">🌧️ Mưa: <b>${luuLuongMua.toFixed(1)}mm</b></div>
                    <div style="background:#e8f5e9; padding:5px; border:1px solid #c8e6c9; text-align:center; grid-column: span 2;">🛡️ Ngưỡng an toàn: <b style="color:green">${nguong.toLocaleString()}</b></div>
                </div>
                <div style="margin-top:10px; padding-top:10px; border-top:1px dashed #ddd;">
                    <label style="font-size:12px;"><b>Xả lũ (m³/s):</b></label>
                    <div style="display:flex; gap:5px; margin-top:5px;">
                        <input type="number" id="inpXa" value="${nguong + 500}" style="width:80px; padding:5px; border:1px solid #ccc; border-radius:4px;">
                        <button onclick="chaySim(${doCao})" style="flex:1; background:#ff4444; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">CHẠY MÔ PHỎNG</button>
                    </div>
                </div>
                <div style="margin-top:5px; font-size:10px; color:#888; text-align:right;">*Dữ liệu từ Open-Meteo API</div>
            </div>
        `;

        // hien popup moi len, de cai loading
        currentMarker = L.marker([lat, lng]).addTo(map).bindPopup(popupHTML).openPopup();
    });
}

// render may cai cham tron tren map
function initializeDams() {
    if (typeof listdap === 'undefined') return;

    listdap.forEach(dap => {
        let color = '#0066ff', targetLayer = damLayers.reservoir;
        let loai = 'Hồ';

        if (dap.dung_tich >= 1000) {
            loai = 'Lớn';
            color = '#33ebff';
            targetLayer = damLayers.large;
        } else if (dap.dung_tich >= 100) {
            loai = 'Vừa';
            color = '#ff9900';
            targetLayer = damLayers.medium;
        }

        L.circleMarker([dap.lat, dap.lng], {
            radius: 8, fillColor: color, color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.9
        }).bindPopup(`
            <div style="text-align:center">
                <img src="${dap.anh}" onclick="openDamDetail('${dap.id}')" 
                     style="width:100%; height:140px; object-fit:cover; border-radius:5px; cursor:pointer; margin-bottom:8px;" 
                     title="Nhấn để xem chi tiết" onerror="this.style.display='none'">
                <div style="font-weight:bold; color:#0066ff; font-size:14px;">${dap.ten}</div>
                <div style="font-size:12px; color:#555; margin-top:5px;">
                    <div>Loại: ${loai}</div>
                    <div>Sông: ${dap.song}</div>
                    <div>Dung tích: <b>${dap.dung_tich}</b> triệu m³</div>
                </div>
            </div>
        `).addTo(targetLayer);
    });
}

// p4: UI AND HELPER

function toggleLegendPanel() {
    const panel = document.getElementById("legendPanel");
    const toggleBtn = document.getElementById("legendToggle");
    panel.classList.toggle("active");
    legendVisible = panel.classList.contains("active");

    if (legendVisible) {
        toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
        toggleBtn.style.padding = "12px";
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-layer-group"></i> Hiện chú thích';
        toggleBtn.style.padding = "";
    }
}

function toggleDamLayer(type, element) {
    if (damStates[type]) {
        map.removeLayer(damLayers[type]);
        element.style.backgroundColor = "#f8faff";
    } else {
        map.addLayer(damLayers[type]);
        element.style.backgroundColor = "#e0f7fa";
    }
    damStates[type] = !damStates[type];
}

// bat tat layer vung nguy hiem
function toggleDangerLayer(element) {
    if (isDangerLayerVisible) {
        map.removeLayer(dangerLayer);
        element.style.backgroundColor = "#f8faff";
    } else {
        dangerLayer.clearLayers();
        const areas = (typeof LIST_DANGER_AREAS !== 'undefined') ? LIST_DANGER_AREAS : Object.keys(dangerCoords);
        
        areas.forEach(areaName => {
            const coords = dangerCoords[areaName];
            if (coords) {
                L.circle(coords, {
                    color: '#ff0000', fillColor: '#ff0000', fillOpacity: 0.4, radius: 25000
                }).bindPopup(`<b>${areaName}</b><br>Khu vực nguy cơ ngập cao`).addTo(dangerLayer);
            }
        });
        map.addLayer(dangerLayer);
        element.style.backgroundColor = "#ffebeb";
    }
    isDangerLayerVisible = !isDangerLayerVisible;
}

// --- chuc nang tim kiem ---
async function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    const results = document.getElementById("searchResults");

    if (!query) { results.style.display = "none"; return; }

    results.innerHTML = '<div style="padding:10px; text-align:center; color:#666"><i class="fas fa-spinner fa-spin"></i> Đang tìm kiếm...</div>';
    results.style.display = "block";

    const normalizedQuery = normalizeString(query);
    let html = "";

    // 1. tim trong local
    if (typeof listdap !== 'undefined') {
        const damResults = listdap.filter(d =>
            normalizeString(d.ten).includes(normalizedQuery) ||
            normalizeString(d.song).includes(normalizedQuery)
        );
        if (damResults.length > 0) {
            html += '<div style="padding:8px 12px; background:#f0f7ff; color:#0066ff; font-weight:bold; font-size:12px;">THỦY ĐIỆN</div>';
            damResults.forEach(d => {
                html += `
                <div class="search-result-item" onclick="flyTo(${d.lat}, ${d.lng}, '${d.ten}')">
                    <i class="fas fa-water"></i>
                    <div>
                        <div class="result-title">${d.ten}</div>
                        <div class="result-subtitle">${d.song}</div>
                    </div>
                </div>`;
            });
        }
    }

    // 2. tim osm (api)
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=3`);
        const osmResults = await response.json();

        if (osmResults.length > 0) {
            html += '<div style="padding:8px 12px; background:#f0f7ff; color:#0066ff; font-weight:bold; font-size:12px;">ĐỊA ĐIỂM</div>';
            osmResults.forEach(p => {
                html += `
                <div class="search-result-item" onclick="flyTo(${p.lat}, ${p.lon}, '${p.display_name.split(',')[0]}')">
                    <i class="fas fa-map-marker-alt" style="color:#ff4444"></i>
                    <div>
                        <div class="result-title">${p.display_name.split(',')[0]}</div>
                        <div class="result-subtitle" style="font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">${p.display_name}</div>
                    </div>
                </div>`;
            });
        }
    } catch (e) { console.error("Lỗi tìm kiếm OSM:", e); }

    if (!html) html = '<div class="no-results" style="padding:15px; text-align:center;">Không tìm thấy kết quả</div>';
    results.innerHTML = html;
}

// --- may cai ham linh tinh ---
function normalizeString(str) {
    return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/đ/g, "d") : "";
}

function flyTo(lat, lng, title) {
    map.setView([lat, lng], 12);
    document.getElementById("searchResults").style.display = "none";
    if (title) document.getElementById("searchInput").value = title;
}

function openDamDetail(damId) {
    const dap = listdap.find(d => d.id === damId);
    if (dap) {
        document.getElementById('damDetailImage').src = dap.anh;
        document.getElementById('damDetailTitle').innerText = dap.ten;
        document.getElementById('damDetailInfo').innerHTML = `<p><strong>Sông:</strong> ${dap.song}</p><p><strong>Dung tích:</strong> ${dap.dung_tich} triệu m³</p>`;
        document.getElementById('damDetailPanel').style.display = 'block';
    }
}

function closeDamDetail() { document.getElementById('damDetailPanel').style.display = 'none'; }

function openImageModal(src) {
    document.getElementById("imageModal").style.display = "block";
    document.getElementById("modalImg").src = src;
}

// ham gia lap
function doiDap(dapId, doCao, luuLuongMua) { console.log("Đổi đập:", dapId); }
function chaySim(doCao) { 
    const xaLu = document.getElementById('inpXa').value;
    alert(`Đang chạy mô phỏng xả lũ: ${xaLu} m³/s`); 
}

// P5: chay chuong trinh
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("legendToggle").addEventListener("click", toggleLegendPanel);
    document.getElementById("searchInput").addEventListener("input", function () {
        if (!this.value.trim()) document.getElementById("searchResults").style.display = "none";
    });

    initializeMap();
    initializeDams();
});