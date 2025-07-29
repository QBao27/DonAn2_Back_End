
$.get('/Admin/ThongKe/ThongKeTongQuan', function (data) {
    $('#tongDoanhThu').text(data.tongDoanhThu.toLocaleString('vi-VN') + ' VND');
    $('#soLuongHoaDon').text(data.soLuongHoaDon);
    $('#tongChuSan').text(data.tongChuSan);
    $('#SoLuongSan').text(data.soluongSan);

    console.log("Thống kê đã load xong:", data);
});
function loadBieuDoTronChuSan() {
    $.ajax({
        url: '/Admin/ThongKe/DoanhThuTheoChuSan',
        type: "GET",
        dataType: "json",
        success: function (data) {
            let chiTiet = data.chiTiet;

            // Gom tổng doanh thu theo TÊN CHỦ SÂN
            let tongTheoChuSan = {};

            chiTiet.forEach(item => {
                let tenChuSan = item.tenChuSan || "Chưa xác định";
                if (tongTheoChuSan[tenChuSan]) {
                    tongTheoChuSan[tenChuSan] += item.tongTien;
                } else {
                    tongTheoChuSan[tenChuSan] = item.tongTien;
                }
            });

            // Chuyển sang format Pie chart
            let pieData = Object.entries(tongTheoChuSan).map(([tenChuSan, tongTien]) => ({
                name: tenChuSan,
                y: tongTien
            }));

            renderBieuDoTronChuSan(pieData);
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi lấy dữ liệu biểu đồ tròn:", status, error);
        }
    });
}
function renderBieuDoTronChuSan(pieData) {
    Highcharts.chart('bieudotron', {
        chart: { type: 'pie' },
        title: { text: 'Doanh thu các chủ sân' },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y:,.0f} VND</b> ({point.percentage:.1f}%)'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %<br>{point.y:,.0f} VND'
                }
            }
        },
        series: [{
            name: 'Tổng doanh thu',
            colorByPoint: true,
            data: pieData
        }]
    });
}




function loadDoanhThuTheoThang() {
    $.ajax({
        url: '/Admin/ThongKe/DoanhThuTheoThang',
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




// Gọi khi trang tải xong
$(document).ready(function () {
    loadBieuDoTronChuSan();
    loadDoanhThuTheoThang();
});



