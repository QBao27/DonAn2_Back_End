$(document).ready(function () {

   
    
})

//hàm kiểm tra dữ liệu đổi mật khẩu
function checkDataDoiMatKhau() {
    // Lấy giá trị của các trường và loại bỏ khoảng trắng thừa
    var matKhauHienTai = $('#mkHienTai1').val().trim();
    var matKhauMoi = $('#mkMoi').val().trim();
    var matKhauMoi1 = $('#mkMoi1').val().trim();

    resetErroDoiMatKhau()

    let isValid = true; // Biến cờ để kiểm tra toàn bộ form


    // --- Kiểm tra Mật khẩu hiện tại ---
    if (matKhauHienTai === '') {
        $('#mkHienTai1Error').text("Bạn chưa nhập mật khẩu hiện tại!");
        $('#mkHienTai1').addClass("input-error");
        isValid = false;
    } else if (matKhauHienTai.length < 6) {
        $('#mkHienTai1Error').text("Mật khẩu hiện tại phải có ít nhất 6 ký tự!");
        $('#mkHienTai1').addClass("input-error");
        isValid = false;
    }

    // --- Kiểm tra Mật khẩu mới ---
    if (matKhauMoi === '') {
        $('#mkMoiError').text("Bạn chưa nhập mật khẩu mới!");
        $('#mkMoi').addClass("input-error");
        isValid = false;
    } else if (matKhauMoi.length < 6) {
        $('#mkMoiError').text("Mật khẩu mới phải có ít nhất 6 ký tự!");
        $('#mkMoi').addClass("input-error");
        isValid = false;
    } else if (matKhauMoi === matKhauHienTai) { // Mật khẩu mới không được giống mật khẩu cũ
        $('#mkMoiError').text("Mật khẩu mới không được trùng với mật khẩu hiện tại!");
        $('#mkMoi').addClass("input-error");
        isValid = false;
    }

    // --- Kiểm tra Nhập lại mật khẩu mới ---
    if (matKhauMoi1 === '') {
        $('#mkMoi1Error').text("Bạn chưa nhập lại mật khẩu mới!");
        $('#mkMoi1').addClass("input-error");
        isValid = false;
    } else if (matKhauMoi1.length < 6) { // Nên kiểm tra độ dài cả trường này
        $('#mkMoi1Error').text("Mật khẩu nhập lại phải có ít nhất 6 ký tự!");
        $('#mkMoi1').addClass("input-error");
        isValid = false;
    } else if (matKhauMoi1 !== matKhauMoi) {
        $('#mkMoi1Error').text("Mật khẩu nhập lại không khớp!");
        $('#mkMoi1').addClass("input-error");
        isValid = false;
    }

    // --- Xử lý thông báo chung ---
    if (!isValid) {
        toastr.warning("Vui lòng kiểm tra lại thông tin bạn đã nhập!", "", {
            timeOut: 1000 // Tăng thời gian hiển thị lên 2 giây để người dùng đọc kịp
        });
    }

    // Bạn có thể thêm các hành động khác nếu isValid là true ở đây,
    // ví dụ: gửi dữ liệu lên server.
     if (isValid) {
         doiMatKhau();
     }

    return isValid;
}

//đóng mở modal
function modalDoiMatKhau() {
    $('#doimk').modal('toggle');
}

//reset thông báo doi mat khau
function resetErroDoiMatKhau() {
    $("#mkHienTai1Error, #mkMoiError, #mkMoi1Error").text('');
    $("#mkHienTai1, #mkMoi, #mkMoi1").removeClass("input-error");
}

//reset thong tin doi mat khau
function resetDataDoiMatKhau() {
    $("#mkHienTai1, #mkMoi, #mkMoi1").val('');
    resetErroDoiMatKhau();
}

//hàm đổi mật khẩu
function doiMatKhau() {
    var matKhauHienTai = $('#mkHienTai1').val().trim();
    var matKhauMoi = $('#mkMoi').val().trim();
    var matKhauMoi1 = $('#mkMoi1').val().trim();


    $.ajax({
        url: "/ChuSanBong/DoiMatKhau/DoiMatKhauChuSan",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            MatKhauHienTai: matKhauHienTai,
            MatKhauMoi: matKhauMoi,
            MatKhauMoi1: matKhauMoi1
        }),
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: "success",
                    title: "Đổi mật khẩu thành công",
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Đổi mật khẩu thất bại",
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Lỗi server!",
                text: "không thể kết nối với máy chủ, vui lòng thử lại sau!",
                confirmButtonText: "OK",
                timer: 2000,
                customClass: {
                    popup: 'custom-swal'
                }
            });
        },
        complete: function () {
            modalDoiMatKhau()
            resetDataDoiMatKhau();
        }
    });
}