// Hàm tạo danh sách giờ dựa theo khoảng thời gian
function loadTimeOptions(interval) {
    let select = $("#selectGio");
    select.empty().append('<option selected value="">Chọn khung giờ</option>'); // Xóa options cũ

    if (interval === 1) {
        // Khi thời lượng là 1 giờ: 08:00 - 09:00, 09:00 - 10:00, ..., 23:00 - 24:00
        for (let i = 8; i < 23; i++) {
            let startHour = i.toString().padStart(2, '0');
            let endHour = (i + 1).toString().padStart(2, '0');
            select.append(`<option value="${startHour}:00">${startHour}:00 - ${endHour}:00</option>`);
        }
    } else if (interval === 1.5) {
        // Khi thời lượng là 1.5 giờ: tạo option theo chuỗi liên tiếp
        let startTime = 8 * 60; // Bắt đầu từ 8:00 (tính bằng phút từ nửa đêm)
        let endOfDay = 24 * 60; // Giới hạn cuối ngày là 24:00 (1440 phút)

        // Vòng lặp chạy cho đến khi khoảng thời gian kết thúc vượt qua 24:00
        while (startTime + 90 <= endOfDay) {
            let startHour = Math.floor(startTime / 60).toString().padStart(2, '0');
            let startMin = (startTime % 60).toString().padStart(2, '0');
            let optionStart = `${startHour}:${startMin}`;

            let endTime = startTime + 90;
            let endHour = Math.floor(endTime / 60) % 24;
            let endMin = (endTime % 60).toString().padStart(2, '0');
            let optionEnd = `${endHour.toString().padStart(2, '0')}:${endMin}`;

            select.append(`<option value="${optionStart}">${optionStart} - ${optionEnd}</option>`);

            startTime += 90; // Tăng startTime thêm 90 phút cho khoảng thời gian kế tiếp
        }
    }
}

// Hàm cập nhật trạng thái disable cho các option nếu ngày được chọn là hôm nay
function updateTimeOptionsForToday() {
    let selectedDateStr = $("#myIDQLDS").val();
    if (!selectedDateStr) return;

    // Parse ngày được chọn theo định dạng "d-m-Y"
    let parts = selectedDateStr.split("-");
    let selectedDate = new Date(parts[2], parts[1] - 1, parts[0]);
    let today = new Date();

    // So sánh ngày (bỏ qua thời gian)
    if (selectedDate.toDateString() === today.toDateString()) {
        let currentHour = today.getHours();
        let currentMinute = today.getMinutes();

        $("#selectGio option").each(function () {
            let timeVal = $(this).attr("value");
            // Bỏ qua option mặc định không có value
            if (!timeVal) return;
            let timeParts = timeVal.split(":");
            let optionHour = parseInt(timeParts[0], 10);
            let optionMinute = parseInt(timeParts[1], 10);

            // Nếu giờ của option nhỏ hơn giờ hiện tại hoặc bằng giờ hiện tại nhưng phút nhỏ hơn hoặc bằng thì disable
            if (optionHour < currentHour || (optionHour === currentHour && optionMinute <= currentMinute)) {
                $(this).prop("disabled", true);
            } else {
                $(this).prop("disabled", false);
            }
        });
    } else {
        // Nếu không phải ngày hôm nay thì cho phép tất cả option
        $("#selectGio option").prop("disabled", false);
    }
}

//hàm tìm kiếm 
function TimKiemThongTinSanQLDS() {
    let keyword = $("#searchQuanLyDatSan").val().toLowerCase();

    $("#danhSachSanQLDS tr").each(function () {
        let rowText = $(this).text().toLowerCase(); // Lấy toàn bộ nội dung hàng
        if (rowText.includes(keyword)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

$(document).ready(function () {
    // Giả sử bạn có một <select id="selectThoiLuong"> để chọn khoảng thời gian (1 hoặc 1.5)
    $("#selectThoiLuong").change(function () {
        let interval = parseFloat($(this).val());
        loadTimeOptions(interval);
        updateTimeOptionsForToday();
    });

    //reset tìm kiếm 
    $('#btnResetSearchQLDS').click(function () {
        $('#searchQuanLyDatSan').val('');
        $('#myIDQLDS').val('');
        $('#selectThoiLuong').val('').prop('selectedIndex', 0);
        $("#selectGio").empty().append('<option selected value="">Chọn khung giờ</option>'); // Xóa options cũ
        LoadThongTinSanBong();
    });

    $("#myIDQLDS").change(function () {
        $('#selectGio').val('').prop('selectedIndex', 0);
        LoadThongTinSanBong();
    });

    $("#selectGio").change(function () {
        LoadThongTinSanBong();
    });

    //gọi hàm tìm kiếm 
    $('#searchQuanLyDatSan').keyup(function () {
        TimKiemThongTinSanQLDS();
    });

    $('#searchThanhToan').keyup(function () {
        TimKiemThongTinSanTT();
    });
});

//Hàm load sân bóng
function LoadThongTinSanBong() {
    let ngayNhan = $('#myIDQLDS').val() || null;
    let khungGio = $('#selectGio').val() || null;
    let thoiLuong = $('#selectThoiLuong').val() || null;

    let thoiLuongGui = thoiLuong;

    if (thoiLuong == null) {
        thoiLuongGui = "0"
    }
    else if (thoiLuong == 1) {
        thoiLuongGui = "60"
    }
    else if (thoiLuong == 1.5) {
        thoiLuongGui = "90";
    }

    let ngayNhanGui = ngayNhan;

    if (ngayNhan != null) {
        ngayNhanGui = convertToMDY(ngayNhan);
    }
    
    $.ajax({
        url: "/ChuSanBong/QuanLyDatSan/LoadSanBong",
        type: "GET",
        data: {
            NgayNhan: ngayNhanGui,
            KhungGio: khungGio,
            ThoiLuong: thoiLuongGui
        },
        success: function (response) {
            if (response.success) {
                let tbody = $("#danhSachSanQLDS");
                tbody.empty(); // Xóa danh sách cũ

                if (response.data.length > 0) {
                    let soThuTu = 1;
                    response.data.forEach(function (i) {
                        let row = "";

                        if (i.trangThaiThanhToan === "Chưa thanh toán") {
                            row = `
                        <tr>
                            <th scope="row">${soThuTu}</th>
                            <td class="me-2">${i.tenSan}</td>
                            <td>${i.loaiSan}</td>
                            <td class="text-center"><span class="giaSanDat">${i.giaSan}</span> / 1h</td>
                            <td>${i.trangThai}</td>
                            <td class="text-secondary">${i.trangThaiThanhToan}</td>
                            <td>
                                <button type="button" class="btn btn-success btn-sm w-100"
                                        style="border-radius: 10px;"
                                        onclick="modalThanhToan(), getDataDatSan(${i.maDatSan})"
                                        data-giasan="${i.giaSan}">
                                    Thanh toán
                                </button>
                            </td>
                        </tr>`
                        }

                        else if (i.trangThaiThanhToan === "Đã thanh toán") {
                            row = `
                        <tr>
                            <th scope="row">${soThuTu}</th>
                            <td class="me-2">${i.tenSan}</td>
                            <td>${i.loaiSan}</td>
                            <td class="text-center"><span class="giaSanDat">${i.giaSan}</span> / 1h</td>
                            <td>${i.trangThai}</td>
                            <td class="text-secondary">${i.trangThaiThanhToan}</td>
                            <td>
                                <button type="button" class="btn btn-warning btn-sm w-100"
                                        style="border-radius: 10px;"
                                        onclick="modalXemThongTin(), getDataDatSan(${i.maDatSan})"
                                        data-giasan="${i.giaSan}">
                                    Xem thông tin
                                </button>
                            </td>
                        </tr>`
                        }

                        else {
                            row = `
                        <tr>
                            <th scope="row">${soThuTu}</th>
                            <td class="me-2">${i.tenSan}</td>
                            <td>${i.loaiSan}</td>
                            <td class="text-center"><span class="giaSanDat">${i.giaSan}</span> / 1h</td>
                            <td>${i.trangThai}</td>
                            <td class="text-secondary">${i.trangThaiThanhToan}</td>
                            <td>
                                <button type="button" class="btn btn-secondary btn-sm w-100"
                                        style="border-radius: 10px;"
                                        onclick="modalDatSanTrong(this)"
                                        data-giasan="${i.giaSan}"  data-tensan="${i.tenSan}" data-masan="${i.maSan}">
                                    Đặt sân bóng
                                </button>
                            </td>
                        </tr>`
                        }
                        tbody.append(row);
                        soThuTu++;
                    });
                } else {
                    // Nếu không có dữ liệu, hiển thị thông báo
                    tbody.append('<tr><td colspan="7" class="text-center text-danger">Không có danh sách sân</td></tr>');
                }
            } else {
                console.log("Lỗi: " + response.message);
            }
        },
        error: function () {
            Swal.fire({
                icon: "error",
                title: "Lỗi kết nối",
                text: "Không thể kết nối với máy chủ!",
                confirmButtonText: "OK",
                timer: 2000
            });
        }
    });

}

//Hàm chỉnh lại định dạng ngày 
function convertToMDY(dateStr) {
    const parts = dateStr.split("-");
    const d = parts[0];
    const m = parts[1];
    const y = parts[2];
    return `${m}-${d}-${y}`; // mm-dd-yyyy
}

//kiểm tra dữ liệu đặt sân trống
function checkDataDatSanTrong() {
    let hoTen = $('#hotenDatSan').val().trim();
    let soDienThoai = $('#soDienThoaiDatSan').val().trim();
    let ngayNhan = $('#ngayNhanDatSan').val().trim();
    let khungGio = $('#khungGioDatSan').val().trim();
    let thoiLuong = $('#thoiLuongDatSan').val().trim();

    let isValid = true;

    if (hoTen === '') {
        $('#hotenDatSanError').text("Bạn chưa nhập họ tên!");
        isValid = false;
    }
    if (soDienThoai === '') {
        $('#soDienThoaiDatSanError').text("Bạn chưa nhập số điện thoại!");
        isValid = false;
    }

    let phonePattern = /^[0-9]{10}$/;
    if (soDienThoai && !phonePattern.test(soDienThoai)) {
        $("#soDienThoaiDatSanError").text("Số điện thoại không hợp lệ!");
        isValid = false;
    }

    if (ngayNhan === "Chưa chọn ngày") { 
        $("#ngayNhanDatSanError").text("Bạn chưa chọn ngày nhận!");
        isValid = false;
    }

    if (khungGio === "Chọn khung giờ") {
        $("#khungGioDatSanError").text("Bạn chưa chọn khung giờ!");
            isValid = false;
    }

    if (thoiLuong === "0 Phút") {
        $("#thoiLuongDatSanError").text("Bạn chưa chọn thời lượng!");
            isValid = false; 
    }

    if (!isValid) {
        toastr.warning("Bạn chưa nhập thông tin!", "", {
            timeOut: 1000 // Giới hạn thời gian hiển thị là 1 giây
        });
    }
    else {
        datSanTrong();
    }
   
    return isValid;
}

//reset data 
function resetDataDatSan() {
    $("#hotenDatSan, #soDienThoaiDatSan").val('');
    resetErrorDatSan();
}

//reset thông báo lỗi 
function resetErrorDatSan() {
    $("#hotenDatSanError, #soDienThoaiDatSanError, #ngayNhanDatSanError, #khungGioDatSanError, #thoiLuongDatSanError").text('');
}

//Đóng mở modal đặt sân
function modalDatSanTrong(btn) {
    $('#modalDatSanTrong').modal('toggle');
     //Lấy dữ liệu
    let ngayNhan = $('#myIDQLDS').val().trim() || null;
    let thoiLuong = $('#selectThoiLuong').val().trim() || null;
    let khungGio = $('#selectGio option:selected').text().trim() || null;
    let giaSan = Number($(btn).data('giasan'));

    // Lấy dữ liệu sân từ nút gọi modal
    let maSan = $(btn).data('masan');
    let tenSan = $(btn).data('tensan');

    let soPhut = 0;

    if (thoiLuong === "1") {
        soPhut = 60;
    } else if (thoiLuong === "1.5") {
        soPhut = 90;
    } else if (thoiLuong === "2") {
        soPhut = 120;
    }

    // Đưa vào các input trong modal
    $('#ngayNhanDatSan').val(ngayNhan || "Chưa chọn ngày");
    $('#thoiLuongDatSan').val(soPhut + " Phút");
    $('#khungGioDatSan').val(khungGio || "Chưa chọn khung giờ");
    $('#tongthanhToanDatSan').val(giaSan * Number(thoiLuong) + " VND");

    // Gán maSan & tenSan vào nút "Đặt sân" trong modal
    $('#btnDatSanTrong').data('masan', maSan);
    $('#btnDatSanTrong').data('tensan', tenSan);

    resetDataDatSan();
}

// Đóng mở modal xem thông tin
function modalXemThongTin() {
    $('#modalXemThongTin').modal('toggle');
}

// Đóng mở modal thanh toán
function modalThanhToan() {
    $('#modalThanhToanSan').modal('toggle');
}

$(document).ready(function () {
    $("#hotenDatSan, #soDienThoaiDatSan").on("focus", function () {
        $(this).removeClass("input-error"); // Xóa class lỗi
        $("#" + this.id + "Error").text(''); // Xóa thông báo lỗi
    });

    $('#btnDatSanTrong').click(function () {
        checkDataDatSanTrong();
    });

    updateTrangThaiSan();

    loadThongTinThanhToan();
});

//ham hiển thị thông tin lên modal
function getDataDatSan(id) {
    if (id == null) {
        console.log("Mã đặt sân không hợp lệ!");
        return;
    }

    $.ajax({
        url: "/ChuSanBong/QuanLyDatSan/getThongTinDatSan?maDatSan=" + id,
        type: "GET",
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                var tongThanhToan = response.data.gia * (response.data.thoiLuong / 60);
                // Gán dữ liệu cho modal "Xem Thông Tin"
                $("#hoTenDaDat").val(response.data.hoVaTen);
                $("#soDienThoaiDaDat").val(response.data.soDienThoai);
                $("#ngayNhanDaDat").val(response.data.ngayDat);
                $("#khungGioDaDat").val(response.data.gioDat);
                $("#thoiLuongDaDat").val(response.data.thoiLuong);
                $("#yeuCauDaDat").val(response.data.ghiChu);
                $("#tongThanhToanDaDat").val(tongThanhToan + " VND");

                // Gán dữ liệu cho modal "Thanh Toán"
                $("#hoTenTT").val(response.data.hoVaTen);
                $("#soDienThoaiTT").val(response.data.soDienThoai);
                $("#ngayNhanTT").val(response.data.ngayDat);
                $("#khungGioTT").val(response.data.gioDat);
                $("#thoiLuongTT").val(response.data.thoiLuong);
                $("#yeuCauTT").val(response.data.ghiChu);
                $("#tongThanhToanTT").val(tongThanhToan + " VND"); 

                $("#btnThanhToanDatSan").off("click").on("click", function () {
                    thanhToanDatSan(response.data.maDatSan);
                });
            }
            else {
                toastr.error(response.message, "", {
                    timeOut: 2000 // Giới hạn thời gian hiển thị là 1 giây
                });
            }
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Lỗi hệ thống",
                text: "không thể kết nối với máy chủ, vui lòng thử lại sau!",
                confirmButtonText: "OK",
                timer: 2000,
                customClass: {
                    popup: 'custom-swal'
                }
            });
        }
    });
}

// Hàm xử lý nút thanh toán
function thanhToanDatSan(id) {
    if (id == null) {
        console.log("Mã đặt sân không hợp lệ!");
        return;
    }

    Swal.fire({
        title: "Xác nhận thanh toán",
        text: "Bạn có chắc chắn muốn thanh toán?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có, thanh toán!",
        cancelButtonText: "Hủy",
        reverseButtons: true,
        customClass: {
            popup: 'custom-swal'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Người dùng đã xác nhận
            $.ajax({
                url: "/ChuSanBong/QuanLyDatSan/UpdateTrangThaiTT?id=" + id,
                type: "GET", // hoặc "POST" tùy theo controller bạn xử lý
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        Swal.fire({
                            icon: "success",
                            title: "Thành công",
                            text: response.message,
                            timer: 2000,
                            showConfirmButton: false
                        });

                        // Gọi lại hàm modal hoặc reload nếu cần
                        modalThanhToan();
                        LoadThongTinSanBong();
                        loadThongTinThanhToan();
                    } else {
                        toastr.error(response.message, "", {
                            timeOut: 2000
                        });
                    }
                },
                error: function (xhr) {
                    Swal.fire({
                        icon: "error",
                        title: "Lỗi hệ thống",
                        text: "Không thể kết nối với máy chủ, vui lòng thử lại sau!",
                        confirmButtonText: "OK",
                        timer: 2000,
                        customClass: {
                            popup: 'custom-swal'
                        }
                    });
                }
            });
        }
    });
}

//Hàm xử lý đặt sân trống
function datSanTrong() {
    let hoTenKhachHang = $('#hotenDatSan').val().trim();
    let soDienThoaiKhachHang = $('#soDienThoaiDatSan').val().trim();
    let ngayNhan = $('#myIDQLDS').val() || null;
    let gioNhan = $('#selectGio').val() || null;
    let gioNhanGui = gioNhan ? gioNhan + ':00' : null;
    let thoiLuong = parseFloat($('#selectThoiLuong').val().trim()) || 0;
    let ghiChu = $('#ghiChuDatSan').val().trim() || "Không có";

    let btn = $('#btnDatSanTrong');
    let tenSan = btn.data('tensan');
    let maSan = btn.data('masan');

    let ngayNhanGui = ngayNhan;
    if (ngayNhan != null) {
        ngayNhanGui = convertToYMD(ngayNhan);
    }
    let thoiLuongGui = thoiLuong * 60;

    const model = {
        hoTenKH: hoTenKhachHang,
        soDienThoaiKH: soDienThoaiKhachHang,
        NgayDat: ngayNhanGui,
        GioDat: gioNhanGui,
        ThoiLuong: thoiLuongGui,
        GhiChu: ghiChu,
        MaSan: maSan,
        TenSan: tenSan
    };
    console.log(model);

    Swal.fire({
        title: "Xác nhận đặt sân",
        text: "Bạn có chắc chắn muốn đặt sân?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có, đặt ngay!",
        cancelButtonText: "Hủy",
        reverseButtons: true,
        customClass: {
            popup: 'custom-swal'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Người dùng đã xác nhận
            $.ajax({
                url: "/ChuSanBong/QuanLyDatSan/datSanTrong",
                type: "POST",
                contentType: "application/json",
                headers: { "Accept": "application/json" },
                data: JSON.stringify(model),
                success: function (response) {
                    if (response.success) {
                        Swal.fire({
                            icon: "success",
                            title: "Thành công",
                            text: response.message,
                            timer: 2000,
                            showConfirmButton: false
                        });
                        $('#modalDatSanTrong').modal('toggle');
                        LoadThongTinSanBong();
                    } else {
                        toastr.error(response.message, "", {
                            timeOut: 2000
                        });
                    }
                },
                error: function (xhr) {
                    Swal.fire({
                        icon: "error",
                        title: "Lỗi hệ thống",
                        text: "Không thể kết nối với máy chủ, vui lòng thử lại sau!",
                        confirmButtonText: "OK",
                        timer: 2000,
                        customClass: {
                            popup: 'custom-swal'
                        }
                    });
                }
            });
        }
    });

    //Hàm chỉnh lại định dạng ngày theo dateOnly
    function convertToYMD(dateStr) {
        const parts = dateStr.split("-");
        const d = parts[0];
        const m = parts[1];
        const y = parts[2];
        return `${y}-${m}-${d}`; // mm-dd-yyyy
    }
   
}

//hàm cập nhật trạng thái sân
function updateTrangThaiSan() {
    $.ajax({
        url: '/ChuSanBong/QuanLyDatSan/UpdateTrangThaiSan', // Đường dẫn API của bạn
        type: 'POST',
        success: function (response) {
            LoadThongTinSanBong();
        },
        error: function (xhr, error) {
            console.error('Lỗi khi cập nhật trạng thái sân:', error);
        }
    });
}

//5 phút gọi hàm 1 lần 
setInterval(updateTrangThaiSan, 300000);

//Hàm hiển thị danh sách thông tin đặt sân chưa thanh toán
function loadThongTinThanhToan() {
    $.ajax({
        url: '/ChuSanBong/ThanhToan/getThongTinDatSanTT', // Đường dẫn API của bạn
        type: 'GET', // Vì API sử dụng [HttpGet]
        dataType: 'json', // Dữ liệu trả về dạng JSON
        success: function (response) {
            if (response.success) {
                var tbody = $("#danhSachSanThanhToan");
                tbody.empty(); // Xóa nội dung cũ nếu có
                if (response.data.length > 0) {
                    $.each(response.data, function (index, item) {
                        // Xây dựng chuỗi HTML cho từng dòng
                        var row = `<tr>
                        <th scope="row">${index + 1}</th>
                        <td class="me-2">${item.tenSan}</td>
                        <td>${item.loaiSan}</td>
                        <td class="text-center">${item.giaSan} / 1h</td>
                        <td>${item.trangThaiSan}</td>
                        <td class="text-secondary">${item.trangThaiThanhToan}</td>
                        <td>
                            <button type="button" class="btn btn-success btn-sm w-100" style="border-radius: 10px;" onclick="getDataDatSan(${item.maDatSan}); modalThanhToan();">
                                Thanh toán
                            </button>
                        </td>
                    </tr>`;

                        tbody.append(row);
                    });
                }
                else {
                    // Nếu không có dữ liệu, hiển thị thông báo
                    tbody.append('<tr><td colspan="7" class="text-center text-danger">Không có danh sách sân</td></tr>');
                }
                // Duyệt qua từng phần tử trong mảng data
                
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi hệ thống",
                    text: response.message,
                    confirmButtonText: "OK",
                    timer: 2000,
                    customClass: {
                        popup: 'custom-swal'
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi hệ thống",
                text: "Không thể kết nối với máy chủ, vui lòng thử lại sau!",
                confirmButtonText: "OK",
                timer: 2000,
                customClass: {
                    popup: 'custom-swal'
                }
            });
        }
    });
}

//Hàm tìm kiếm bên thanh toán
//hàm tìm kiếm 
function TimKiemThongTinSanTT() {
    let keyword = $("#searchThanhToan").val().toLowerCase();

    $("#danhSachSanThanhToan tr").each(function () {
        let rowText = $(this).text().toLowerCase(); // Lấy toàn bộ nội dung hàng
        if (rowText.includes(keyword)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}


