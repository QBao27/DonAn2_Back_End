function LoadSoLuongHoaDon() {
    $.ajax({
        url: '/ChuSanBong/ThongKe/SoLuongHoaDon',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data && data.soLuongHoaDon !== undefined) {
                $("#SoLuongHoaDon").text(data.soLuongHoaDon);  // Cập nhật vào thẻ
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi AJAX:", status, error);
        }
    });
}

function laySoLuongSan() {
    $.ajax({
        url: '/ChuSanBong/ThongKe/SoLuongSan',
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data && data.soLuongSan !== undefined) {
                $("#SoLuongSanThonKe").text(data.soLuongSan);
            } else {
                console.error("Dữ liệu không hợp lệ:", data);
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi lấy số lượng sân:", status, error);
        }
    });
}


function laySoLuongDanhGia() {
    $.ajax({
        url: '/ChuSanBong/ThongKe/SoLuongDanhGia',
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data && data.soLuongDanhGia !== undefined) {
                $("#SoLuongDanhGia").text(data.soLuongDanhGia);
            } else {
                console.error("Dữ liệu không hợp lệ:", data);
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi lấy số lượng đánh giá:", status, error);
        }
    });
}

function layTongGiaTriDatSan() {
    $.ajax({
        url: '/ChuSanBong/ThongKe/TongGiaTriDatSan',
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data && data.tongGiaTri !== undefined) {
                $("#TongGiaTriDatSan").text(data.tongGiaTri);
            } else {
                console.error("Dữ liệu không hợp lệ:", data);
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi lấy tổng giá trị đặt sân:", status, error);
        }
    });
}

function loadDoanhThuSan() {
    $.ajax({
        url: '/ChuSanBong/ThongKe/DoanhThuSan',
        type: "GET",
        dataType: "json",
        success: function (data) {

            if (!Array.isArray(data)) {
                data = Object.values(data);
            }

            // Tạo danh sách đủ 12 tháng
            let thangLabels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

            let danhSachSan = [...new Set(data.map(item => item.tenSan))];

            let seriesData = danhSachSan.map(san => ({
                name: san,
                data: thangLabels.map(thang => {
                    let thangSo = parseInt(thang.replace("Tháng ", ""));
                    let doanhThuThang = data.find(item => item.thang === thangSo && item.tenSan === san);
                    return doanhThuThang ? doanhThuThang.tongTien : 0;
                })
            }));
            renderBieuDoDoanhThu(thangLabels, seriesData);
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi lấy dữ liệu doanh thu sân:", status, error);
        }
    });
}

function renderBieuDoDoanhThu(thangLabels, seriesData) {
    Highcharts.chart('bieudoduong', {
        title: { text: 'Biểu đồ doanh thu theo tháng' },
        xAxis: { categories: thangLabels },
        yAxis: {
            title: { text: 'Tổng doanh thu (VND)' }
        },
        series: seriesData
    });
}



function loadDoanhThuTheoThang() {
    $.ajax({
        url: '/ChuSanBong/ThongKe/DoanhThuTheoThang',
        type: "GET",
        dataType: "json",
        success: function (data) {
            let thangLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
            let doanhThuData = Array(12).fill(0);

            data.forEach(item => {
                if (item.thang >= 1 && item.thang <= 12) {
                    doanhThuData[item.thang - 1] = item.tongTien;
                }
            });
            renderBieuDoCot(thangLabels, doanhThuData);
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi lấy dữ liệu doanh thu theo tháng:", status, error);
        }
    });
}

function renderBieuDoCot(thangLabels, doanhThuData) {

    Highcharts.chart('bieudocot', {
        chart: { type: 'column' },
        title: { text: 'Biểu đồ doanh thu theo tháng' },
        xAxis: { categories: thangLabels, crosshair: true },
        yAxis: { title: { text: 'Tổng doanh thu (VND)' } },
        tooltip: { shared: true, valueSuffix: ' VND' },
        series: [{ name: 'Tổng doanh thu', data: doanhThuData, color: 'blue' }]
    });
}

$(document).ready(function () {
    loadDoanhThuTheoThang();
});




// Gọi khi trang tải xong
$(document).ready(function () {
    LoadSoLuongHoaDon();
    laySoLuongSan();
    laySoLuongDanhGia();
    layTongGiaTriDatSan();
    loadDoanhThuSan();
    loadDoanhThuTheoThang();
});
