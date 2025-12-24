// day la file logic.js

///////////////////////////////////////////////////////////////////////////////////////////////////
// day la file cua T
const listdap = [
    // Mien Bac
    { id: 'd01', ten: 'Thủy điện Sơn La', lat: 21.491, lng: 103.981, song: 'Sông Đà', dung_tich: 9260, anh: 'images/sonla.jpg' },
    { id: 'd02', ten: 'Thủy điện Hòa Bình', lat: 20.814, lng: 105.337, song: 'Sông Đà', dung_tich: 9000, anh: 'images/hoabinh.jpg' },
    { id: 'd03', ten: 'Thủy điện Lai Châu', lat: 22.137, lng: 102.998, song: 'Sông Đà', dung_tich: 1215, anh: 'images/laichau.jpg' },
    { id: 'd04', ten: 'Thủy điện Tuyên Quang', lat: 22.353, lng: 105.412, song: 'Sông Gâm', dung_tich: 2260, anh: 'images/tuyenquang.jpg' },
    { id: 'd05', ten: 'Thủy điện Thác Bà', lat: 21.748, lng: 105.029, song: 'Sông Chảy', dung_tich: 2490, anh: 'images/thacba.jpg' },
    { id: 'd06', ten: 'Thủy điện Huội Quảng', lat: 21.731, lng: 103.856, song: 'Nậm Mu', dung_tich: 180, anh: 'images/macdinh.jpg' },
    { id: 'd07', ten: 'Thủy điện Bản Chát', lat: 21.855, lng: 103.834, song: 'Nậm Mu', dung_tich: 1700, anh: 'images/macdinh.jpg' },
    
    // Mien Trung va Tay Nguyen
    { id: 'd08', ten: 'Thủy điện Bản Vẽ', lat: 19.339, lng: 104.484, song: 'Sông Cả', dung_tich: 1830, anh: 'images/banve.jpg' },
    { id: 'd09', ten: 'Thủy điện Cửa Đạt', lat: 19.876, lng: 105.275, song: 'Sông Chu', dung_tich: 1450, anh: 'images/macdinh.jpg' },
    { id: 'd10', ten: 'Thủy điện Hủa Na', lat: 19.683, lng: 104.756, song: 'Sông Chu', dung_tich: 500, anh: 'images/macdinh.jpg' },
    { id: 'd11', ten: 'Thủy điện Bình Điền', lat: 16.345, lng: 107.502, song: 'Sông Hương', dung_tich: 423, anh: 'images/macdinh.jpg' },
    { id: 'd12', ten: 'Thủy điện A Lưới', lat: 16.201, lng: 107.251, song: 'Sông A Sáp', dung_tich: 60, anh: 'images/macdinh.jpg' },
    { id: 'd13', ten: 'Thủy điện Sông Tranh 2', lat: 15.340, lng: 108.125, song: 'Thu Bồn', dung_tich: 730, anh: 'images/macdinh.jpg' },
    { id: 'd14', ten: 'Thủy điện Đak Mi 4', lat: 15.542, lng: 107.834, song: 'Sông Vu Gia', dung_tich: 312, anh: 'images/macdinh.jpg' },
    { id: 'd15', ten: 'Thủy điện Yaly', lat: 14.225, lng: 107.824, song: 'Sê San', dung_tich: 1037, anh: 'images/yaly.jpg' },
    { id: 'd16', ten: 'Thủy điện Sê San 3', lat: 14.208, lng: 107.721, song: 'Sê San', dung_tich: 162, anh: 'images/macdinh.jpg' },
    { id: 'd17', ten: 'Thủy điện Sê San 4', lat: 14.103, lng: 107.618, song: 'Sê San', dung_tich: 893, anh: 'images/macdinh.jpg' },
    { id: 'd18', ten: 'Thủy điện Plei Krông', lat: 14.412, lng: 107.901, song: 'Pô Kô', dung_tich: 1049, anh: 'images/macdinh.jpg' },
    { id: 'd19', ten: 'Thủy điện Sông Ba Hạ', lat: 13.011, lng: 108.921, song: 'Sông Ba', dung_tich: 350, anh: 'images/macdinh.jpg' },
    { id: 'd20', ten: 'Thủy điện Sông Hinh', lat: 12.923, lng: 109.001, song: 'Sông Hinh', dung_tich: 357, anh: 'images/macdinh.jpg' },

    // Mien Nam
    { id: 'd21', ten: 'Thủy điện Trị An', lat: 11.118, lng: 107.001, song: 'Sông Đồng Nai', dung_tich: 2760, anh: 'images/trian.jpg' },
    { id: 'd22', ten: 'Thủy điện Thác Mơ', lat: 11.854, lng: 106.985, song: 'Sông Bé', dung_tich: 1360, anh: 'images/thacmo.jpg' },
    { id: 'd23', ten: 'Thủy điện Cần Đơn', lat: 11.954, lng: 106.885, song: 'Sông Bé', dung_tich: 400, anh: 'images/macdinh.jpg' },
    { id: 'd24', ten: 'Thủy điện Srok Phu Miêng', lat: 11.754, lng: 106.785, song: 'Sông Bé', dung_tich: 200, anh: 'images/macdinh.jpg' },
    { id: 'd25', ten: 'Thủy điện Dầu Tiếng', lat: 11.362, lng: 106.353, song: 'Sài Gòn', dung_tich: 1580, anh: 'images/dautieng.jpg' },
    { id: 'd26', ten: 'Thủy điện Hàm Thuận', lat: 11.278, lng: 107.893, song: 'Sông La Ngà', dung_tich: 695, anh: 'images/macdinh.jpg' },
    { id: 'd27', ten: 'Thủy điện Đa Mi', lat: 11.201, lng: 107.854, song: 'Sông La Ngà', dung_tich: 141, anh: 'images/macdinh.jpg' },
    { id: 'd28', ten: 'Thủy điện Đa Nhim', lat: 11.852, lng: 108.601, song: 'Sông Đa Nhim', dung_tich: 165, anh: 'images/macdinh.jpg' },
    { id: 'd29', ten: 'Thủy điện Đại Ninh', lat: 11.642, lng: 108.305, song: 'Đồng Nai', dung_tich: 251, anh: 'images/macdinh.jpg' },
    { id: 'd30', ten: 'Thủy điện Đồng Nai 3', lat: 11.892, lng: 107.805, song: 'Đồng Nai', dung_tich: 890, anh: 'images/macdinh.jpg' },

    // Cac Dap khac
    { id: 'd31', ten: 'Hồ chứa nước Kẻ Gỗ', lat: 18.234, lng: 105.987, song: 'Rào Cái', dung_tich: 345, anh: 'images/macdinh.jpg' },
    { id: 'd32', ten: 'Hồ Ngàn Trươi', lat: 18.412, lng: 105.512, song: 'Ngàn Trươi', dung_tich: 775, anh: 'images/macdinh.jpg' },
    { id: 'd33', ten: 'Hồ Tả Trạch', lat: 16.312, lng: 107.612, song: 'Sông Hương', dung_tich: 509, anh: 'images/macdinh.jpg' },
    { id: 'd34', ten: 'Thủy điện Hương Điền', lat: 16.567, lng: 107.456, song: 'Sông Bồ', dung_tich: 820, anh: 'images/macdinh.jpg' },
    { id: 'd35', ten: 'Thủy điện Khe Bố', lat: 19.234, lng: 104.678, song: 'Sông Cả', dung_tich: 98, anh: 'images/macdinh.jpg' },
    { id: 'd36', ten: 'Thủy điện Chi Khê', lat: 19.123, lng: 104.890, song: 'Sông Cả', dung_tich: 80, anh: 'images/macdinh.jpg' },
    { id: 'd37', ten: 'Thủy điện Nậm Chiến', lat: 21.654, lng: 104.123, song: 'Nậm Chiến', dung_tich: 150, anh: 'images/macdinh.jpg' },
    { id: 'd38', ten: 'Thủy điện Nậm Na 2', lat: 22.456, lng: 103.234, song: 'Nậm Na', dung_tich: 120, anh: 'images/macdinh.jpg' },
    { id: 'd39', ten: 'Thủy điện Bắc Hà', lat: 22.512, lng: 104.345, song: 'Sông Chảy', dung_tich: 171, anh: 'images/macdinh.jpg' },
    { id: 'd40', ten: 'Thủy điện Trung Sơn', lat: 20.612, lng: 104.812, song: 'Sông Mã', dung_tich: 348, anh: 'images/macdinh.jpg' }
];
///////////////////////////////////////////////////////////////////////////////////////////////////





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
function Haversine(lat1, lon1, lat2, lon2) {
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