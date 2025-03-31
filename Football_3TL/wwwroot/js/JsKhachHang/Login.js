//ham kiem tra thong tin dang nhap
function checkDataLogin() {
    let account = $('#taiKhoanDangNhap').val().trim();
    let password = $('#matKhauDangNhap').val().trim();

    let isValid = true;

    if (account === '') {
        $('#taiKhoanDangNhapError').text("Bạn chưa nhập tên đăng nhập!");
        $('#taiKhoanDangNhap').addClass("input-error"); // Thêm class
        isValid = false;
    }
    if (password === '') {
        $('#matKhauDangNhapError').text("Bạn chưa nhập mật khẩu!");
        $('#matKhauDangNhap').addClass("input-error"); // Thêm class
        isValid = false;
    }

    if(!isValid){
        toastr.warning("Bạn chưa nhập thông tin!", "", { 
            timeOut: 1000 // Giới hạn thời gian hiển thị là 1 giây
        });
    }

    if (isValid) {
        Login();
    }

    return isValid;
}

//reset thông báo lỗi đăng nhập
function resetErrorLogin() {
    $("#taiKhoanDangNhapError").text('');
    $('#taiKhoanDangNhap').removeClass("input-error");

    $("#matKhauDangNhapError").text('');
    $('#matKhauDangNhap').removeClass("input-error");
}

//reset thong tin đăng nhập
function resetDataLogin(){
    $("#taiKhoanDangNhap, #matKhauDangNhap").val('');
    resetErrorLogin();
}

//đóng mở modal đăng nhập
function modalLogin(){
    $('#modalDangNhap').modal('toggle');
    resetDataLogin();
}

//Khi trang tải xong thì mới chạy
$(document).ready(function () {
    //focus vào thì xóa thong báo lỗi
    $("#taiKhoanDangNhap, #matKhauDangNhap").on("focus", function () {
        $(this).removeClass("input-error"); // Xóa class lỗi
        $("#" + this.id + "Error").text(''); // Xóa thông báo lỗi
    });
})

//Hàm đăng nhập
function Login() {
    let account = $('#taiKhoanDangNhap').val().trim();
    let password = $('#matKhauDangNhap').val().trim();

    //Vô hiệu hóa nút đăng nhập
    $('#btnLogin').prop("disabled", true).text("Đang đăng nhập...");

    $.ajax({
        url: "/KhachHang/Account/Login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            TaiKhoan: account,
            MatKhau: password
        }),
        success: function (response) {
            if (response.success) {
                window.location.href = response.redirectUrl;
                modalLogin();
            }
            else {
                if (response.checkPassword == false) {
                    toastr.error(response.message, "", {
                        timeOut: 2000 // Giới hạn thời gian hiển thị là 1 giây
                    });
                    $('#matKhauDangNhap').val("");
                }
                else {
                    toastr.error(response.message, "", {
                        timeOut: 2000 // Giới hạn thời gian hiển thị là 1 giây
                    });
                    resetDataLogin();
                }
            }
        },
        error: function(xhr){
            Swal.fire({
                icon: "error",
                title: "Lỗi đăng nhập",
                text: "không thể kết nối với máy chủ, vui lòng thử lại sau!",
                confirmButtonText: "OK",
                timer: 2000,
                customClass: {
                    popup: 'custom-swal'
                }
            });
        },
        complete: function () {
            $('#btnLogin').prop("disabled", false).text("Đăng Nhập");
        }

    });
}