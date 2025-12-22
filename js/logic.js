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
// Tọa độ User
const userLat = 10.8231;
const userLon = 106.6297;

// Tọa độ Đập thủy lợi
const damLat = 10.9000;
const damLon = 106.8000;

const distance = Haversine(userLat, userLon, damLat, damLon);

console.log(`Khoảng cách: ${distance.toFixed(2)} km`);