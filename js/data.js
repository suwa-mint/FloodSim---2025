// day la file cua T
const listdap = [
    { id: 'd01', ten: 'Thủy điện Sơn La', lat: 21.491, lng: 103.981, song: 'Sông Đà', dung_tich: 9260, anh: 'images/sonla.jpeg', riskRadius: 45, terrain: "dong_bang" },
    { id: 'd02', ten: 'Thủy điện Hòa Bình', lat: 20.814, lng: 105.337, song: 'Sông Đà', dung_tich: 9000, anh: 'images/hoabinh.jpg', riskRadius: 42, terrain: "dong_bang" },
    { id: 'd03', ten: 'Thủy điện Lai Châu', lat: 22.137, lng: 102.998, song: 'Sông Đà', dung_tich: 1215, anh: 'images/laichau.jpg', riskRadius: 38, terrain: "nui_doi" },
    { id: 'd04', ten: 'Thủy điện Tuyên Quang', lat: 22.353, lng: 105.412, song: 'Sông Gâm', dung_tich: 2260, anh: 'images/tuyenquang.webp', riskRadius: 35, terrain: "song_suoi" },
    { id: 'd05', ten: 'Thủy điện Thác Bà', lat: 21.748, lng: 105.029, song: 'Sông Chảy', dung_tich: 2490, anh: 'images/thacba.jpg', riskRadius: 30, terrain: "dong_bang" },
    { id: 'd06', ten: 'Thủy điện Huội Quảng', lat: 21.731, lng: 103.856, song: 'Nậm Mu', dung_tich: 180, anh: 'images/huoiquang.jpg', riskRadius: 28, terrain: "nui_doi" },
    { id: 'd07', ten: 'Thủy điện Bản Chát', lat: 21.855, lng: 103.834, song: 'Nậm Mu', dung_tich: 1700, anh: 'images/banchat.jpg', riskRadius: 32, terrain: "nui_doi" },
    { id: 'd08', ten: 'Thủy điện Bản Vẽ', lat: 19.339, lng: 104.484, song: 'Sông Cả', dung_tich: 1830, anh: 'images/banve.jpg', riskRadius: 33, terrain: "nui_doi" },
    { id: 'd09', ten: 'Thủy điện Cửa Đạt', lat: 19.876, lng: 105.275, song: 'Sông Chu', dung_tich: 1450, anh: 'images/cuadat.jpg', riskRadius: 27, terrain: "song_suoi" },
    { id: 'd10', ten: 'Thủy điện Hủa Na', lat: 19.683, lng: 104.756, song: 'Sông Chu', dung_tich: 500, anh: 'images/huana.jpg', riskRadius: 26, terrain: "song_suoi" },
    { id: 'd11', ten: 'Thủy điện Bình Điền', lat: 16.345, lng: 107.502, song: 'Sông Hương', dung_tich: 423, anh: 'images/binhdien.jpg', riskRadius: 25, terrain: "dong_bang" },
    { id: 'd12', ten: 'Thủy điện A Lưới', lat: 16.201, lng: 107.251, song: 'Sông A Sáp', dung_tich: 60, anh: 'images/aluoi.jpg', riskRadius: 29, terrain: "nui_doi" },
    { id: 'd13', ten: 'Thủy điện Sông Tranh 2', lat: 15.340, lng: 108.125, song: 'Thu Bồn', dung_tich: 730, anh: 'images/songtranh2.webp', riskRadius: 31, terrain: "nui_doi" },
    { id: 'd14', ten: 'Thủy điện Đak Mi 4', lat: 15.542, lng: 107.834, song: 'Sông Vu Gia', dung_tich: 312, anh: 'images/dakmi4.webp', riskRadius: 28, terrain: "nui_doi" },
    { id: 'd15', ten: 'Thủy điện Yaly', lat: 14.225, lng: 107.824, song: 'Sê San', dung_tich: 1037, anh: 'images/yaly.jpg', riskRadius: 34, terrain: "dong_bang" },
    { id: 'd16', ten: 'Thủy điện Sê San 3', lat: 14.208, lng: 107.721, song: 'Sê San', dung_tich: 162, anh: 'images/sesan3.jpg', riskRadius: 30, terrain: "nui_doi" },
    { id: 'd17', ten: 'Thủy điện Sê San 4', lat: 14.103, lng: 107.618, song: 'Sê San', dung_tich: 893, anh: 'images/sesan4.jpg', riskRadius: 30, terrain: "nui_doi" },
    { id: 'd18', ten: 'Thủy điện Plei Krông', lat: 14.412, lng: 107.901, song: 'Pô Kô', dung_tich: 1049, anh: 'images/pleikrong.png', riskRadius: 29, terrain: "nui_doi" },
    { id: 'd19', ten: 'Thủy điện Sông Ba Hạ', lat: 13.011, lng: 108.921, song: 'Sông Ba', dung_tich: 350, anh: 'images/baha.jpg', riskRadius: 36, terrain: "song_suoi" },
    { id: 'd20', ten: 'Thủy điện Sông Hinh', lat: 12.923, lng: 109.001, song: 'Sông Hinh', dung_tich: 357, anh: 'images/songhinh.jpeg', riskRadius: 33, terrain: "song_suoi" },
    { id: 'd21', ten: 'Thủy điện Trị An', lat: 11.118, lng: 107.001, song: 'Sông Đồng Nai', dung_tich: 2760, anh: 'images/trian.jpg', riskRadius: 40, terrain: "dong_bang" },
    { id: 'd22', ten: 'Thủy điện Thác Mơ', lat: 11.854, lng: 106.985, song: 'Sông Bé', dung_tich: 1360, anh: 'images/thacmo.jpg', riskRadius: 37, terrain: "nui_doi" },
    { id: 'd23', ten: 'Thủy điện Cần Đơn', lat: 11.954, lng: 106.885, song: 'Sông Bé', dung_tich: 400, anh: 'images/candon.png', riskRadius: 27, terrain: "song_suoi" },
    { id: 'd24', ten: 'Thủy điện Srok Phu Miêng', lat: 11.754, lng: 106.785, song: 'Sông Bé', dung_tich: 200, anh: 'images/shrokphumieng.png', riskRadius: 28, terrain: "nui_doi" },
    { id: 'd25', ten: 'Thủy điện Dầu Tiếng', lat: 11.362, lng: 106.353, song: 'Sài Gòn', dung_tich: 1580, anh: 'images/dautieng.png', riskRadius: 29, terrain: "dong_bang" },
    { id: 'd26', ten: 'Thủy điện Hàm Thuận', lat: 11.278, lng: 107.893, song: 'Sông La Ngà', dung_tich: 695, anh: 'images/hamthuan.jpg', riskRadius: 30, terrain: "dong_bang" },
    { id: 'd27', ten: 'Thủy điện Đa Mi', lat: 11.201, lng: 107.854, song: 'Sông La Ngà', dung_tich: 141, anh: 'images/dami.jpeg', riskRadius: 28, terrain: "dong_bang" },
    { id: 'd28', ten: 'Thủy điện Đa Nhim', lat: 11.852, lng: 108.601, song: 'Sông Đa Nhim', dung_tich: 165, anh: 'images/danhim.jpg', riskRadius: 26, terrain: "nui_doi" },
    { id: 'd29', ten: 'Thủy điện Đại Ninh', lat: 11.642, lng: 108.305, song: 'Đồng Nai', dung_tich: 251, anh: 'images/daininh.jpg', riskRadius: 27, terrain: "nui_doi" },
    { id: 'd30', ten: 'Thủy điện Đồng Nai 3', lat: 11.892, lng: 107.805, song: 'Đồng Nai', dung_tich: 890, anh: 'images/dongnai3.jpg', riskRadius: 29, terrain: "song_suoi" },
    { id: 'd31', ten: 'Hồ chứa nước Kẻ Gỗ', lat: 18.234, lng: 105.987, song: 'Rào Cái', dung_tich: 345, anh: 'images/kego.jpg', riskRadius: 25, terrain: "dong_bang" },
    { id: 'd32', ten: 'Hồ Ngàn Trươi', lat: 18.412, lng: 105.512, song: 'Ngàn Trươi', dung_tich: 775, anh: 'images/ngantruoi.jpg', riskRadius: 24, terrain: "song_suoi" },
    { id: 'd33', ten: 'Hồ Tả Trạch', lat: 16.312, lng: 107.612, song: 'Sông Hương', dung_tich: 509, anh: 'images/tatrach.jpg', riskRadius: 26, terrain: "nui_doi" },
    { id: 'd34', ten: 'Thủy điện Hương Điền', lat: 16.567, lng: 107.456, song: 'Sông Bồ', dung_tich: 820, anh: 'images/huongdien.jpg', riskRadius: 28, terrain: "nui_doi" },
    { id: 'd35', ten: 'Thủy điện Khe Bố', lat: 19.234, lng: 104.678, song: 'Sông Cả', dung_tich: 98, anh: 'images/khebo.jpg', riskRadius: 26, terrain: "song_suoi" },
    { id: 'd36', ten: 'Thủy điện Chi Khê', lat: 19.123, lng: 104.890, song: 'Sông Cả', dung_tich: 80, anh: 'images/chikhe.jpg', riskRadius: 25, terrain: "song_suoi" },
    { id: 'd37', ten: 'Thủy điện Nậm Chiến', lat: 21.654, lng: 104.123, song: 'Nậm Chiến', dung_tich: 150, anh: 'images/namchien.png', riskRadius: 27, terrain: "nui_doi" },
    { id: 'd38', ten: 'Thủy điện Nậm Na 2', lat: 22.456, lng: 103.234, song: 'Nậm Na', dung_tich: 120, anh: 'images/namna2.jpg', riskRadius: 26, terrain: "nui_doi" },
    { id: 'd39', ten: 'Thủy điện Bắc Hà', lat: 22.512, lng: 104.345, song: 'Sông Chảy', dung_tich: 171, anh: 'images/bacha.jpg', riskRadius: 24, terrain: "nui_doi" },
    { id: 'd40', ten: 'Thủy điện Trung Sơn', lat: 20.612, lng: 104.812, song: 'Sông Mã', dung_tich: 348, anh: 'images/trungson.jpeg', riskRadius: 38, terrain: "song_suoi" }
];

// danh sach vung nguy hiem
const dangerCoords = {
    "Huyện Lệ Thủy (Quảng Bình)": [17.2185, 106.7863],
    "Huyện Minh Hóa (Quảng Bình)": [17.8039, 105.9739],
    "Huyện Hương Khê (Hà Tĩnh)": [18.1722, 105.7117],
    "Vùng rốn lũ Cẩm Xuyên (Hà Tĩnh)": [18.2568, 106.0125],
    "Huyện Hướng Hóa (Quảng Trị)": [16.6342, 106.7356],
    "Huyện Triệu Phong (Quảng Trị)": [16.8378, 107.1856],
    "Huyện Quảng Điền (Huế)": [16.5894, 107.4589],
    "Vùng trũng Hương Trà (Huế)": [16.4172, 107.4967],
    "Huyện Đại Lộc (Quảng Nam)": [15.8744, 108.0839],
    "Huyện Nam Trà My (Quảng Nam)": [15.1972, 108.0875],
    "Huyện Tuy Phước (Bình Định)": [13.8272, 109.1558],
};

const LIST_DANGER_AREAS = Object.keys(dangerCoords);

const VIETNAM_PROVINCES = [
    { name: "Thừa Thiên Huế", type: "Tỉnh", lat: 16.4637, lng: 107.5909 },
    { name: "Quảng Trị", type: "Tỉnh", lat: 16.8500, lng: 107.1000 },
    { name: "Quảng Bình", type: "Tỉnh", lat: 17.4833, lng: 106.6000 },
    { name: "Hà Tĩnh", type: "Tỉnh", lat: 18.3333, lng: 105.9000 },
    { name: "Nghệ An", type: "Tỉnh", lat: 19.2500, lng: 104.8000 },
    { name: "Quảng Nam", type: "Tỉnh", lat: 15.5667, lng: 107.9667 },
    { name: "Phú Yên", type: "Tỉnh", lat: 13.0833, lng: 109.0833 },
    { name: "Khánh Hoà", type: "Tỉnh", lat: 12.2500, lng: 109.1833 },
    { name: "Bình Định", type: "Tỉnh", lat: 13.7833, lng: 109.2167 },
    { name: "Hà Nội", type: "Thành phố", lat: 21.0285, lng: 105.8542 },
    { name: "Hồ Chí Minh", type: "Thành phố", lat: 10.8231, lng: 106.6297 }
];