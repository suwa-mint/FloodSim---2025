// day la file logic.js

function Haversine(lat1, lon1, lat2, lon2){
    const R = 6371; // Bán kính Trái Đất (km)
    const toRad = deg => deg * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
/**
Tìm ba đập gần nhất
 */
function Threenearest(lat1, lon1) {
    // 1. Tạo bản sao danh sách và tính khoảng cách cho từng đập
    const distances = listdap.map(dap => {
        return {
            ...dap,
            distance: Haversine(lat1, lon1, dap.lat, dap.lng)
        };
    });

    // 2. Sắp xếp danh sách theo khoảng cách từ nhỏ đến lớn
    distances.sort((a, b) => a.distance - b.distance);

    // 3. Lấy 3 phần tử đầu tiên
    return distances.slice(0, 3);
} 
// Tìm những đập có bán kính trong R km
function findDamsInRadius(lat1, lon1, radiusKm) {
    // Sử dụng filter để lọc các đập thỏa mãn điều kiện khoảng cách <= radiusKm
    const results = listdap.filter(dap => {
        const distance = Haversine(lat1, lon1, dap.lat, dap.lng);
        
        // Lưu khoảng cách vào object để tiện hiển thị sau này
        dap.distance = distance; 
        
        return distance <= radiusKm;
    });

    // Sắp xếp kết quả từ gần đến xa
    return results.sort((a, b) => a.distance - b.distance);
}