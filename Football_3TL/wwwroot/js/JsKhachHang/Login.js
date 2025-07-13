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
        url: "/Customer/Account/Login",
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

//Modal quên mật khẩu
function modalFogetPassword() {
    $('#forgotPasswordModal').modal('toggle');
}

//function KiemTraEmail() {
//    var email = $("#emailFogetPassword").val().trim();
//    if (email == "") {
//        $("#emailFogetPasswordError").text("Vui lòng nhập email.");
//        return;
//    }

//    $.ajax({
//        url: '/Customer/MailTest/ForgotPassword_CheckEmail',
//        type: 'POST',
//        data: { email: email },
//        success: function (res) {
//            if (res.success) {
//                alert(res.message);
//                modalFogetPassword()
//                confirmModal()
//            } else {
//                $("#emailFogetPasswordError").text(res.message);
//            }
//        },
//        error: function () {
//            alert("Có lỗi xảy ra!");
//        }
//    });
//}

function KiemTraEmail() {
    var email = $("#emailFogetPassword").val().trim();
    if (email == "") {
        $("#emailFogetPasswordError").text("Vui lòng nhập email.");
        return;
    }

    $.ajax({
        url: '/Customer/MailTest/ForgotPassword_CheckEmail',
        type: 'POST',
        data: { email: email },
        success: function (res) {
            if (res.success) {
                // ✅ Dùng SweetAlert thay alert()
                Swal.fire({
                    title: 'Đã gửi Email!',
                    text: res.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        modalFogetPassword();
                        confirmModal();
                    }
                });
            } else {
                $("#emailFogetPasswordError").text(res.message);
            }
        },
        error: function () {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}


//function KiemTraOtp() {
//    // Lấy tất cả input OTP
//    var otpInputs = document.querySelectorAll('.otp-input');
//    var otp = "";
//    otpInputs.forEach(input => {
//        otp += input.value.trim();
//    });

//    if (otp.length !== 6) {
//        $("#otpError").text("Vui lòng nhập đủ 6 số OTP!");
//        return;
//    }

//    $.ajax({
//        url: '/Customer/MailTest/VerifyOtp',
//        type: 'POST',
//        data: { otp: otp },
//        success: function (res) {
//            if (res.success) {
//                alert(res.message);
//                // Đóng modal OTP & mở modal đổi mật khẩu
//                confirmModal()
//                newPassWordModal()
//            } else {
//                $("#otpError").text(res.message);
//            }
//        },
//        error: function () {
//            alert("Có lỗi xảy ra khi kiểm tra OTP.");
//        }
//    });
//}

function KiemTraOtp() {
    // Lấy tất cả input OTP
    var otpInputs = document.querySelectorAll('.otp-input');
    var otp = "";
    otpInputs.forEach(input => {
        otp += input.value.trim();
    });

    if (otp.length !== 6) {
        $("#otpError").text("Vui lòng nhập đủ 6 số OTP!");
        return;
    }

    $.ajax({
        url: '/Customer/MailTest/VerifyOtp',
        type: 'POST',
        data: { otp: otp },
        success: function (res) {
            if (res.success) {
                Swal.fire({
                    title: 'Xác nhận thành công!',
                    text: res.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Đóng modal OTP & mở modal đổi mật khẩu
                        confirmModal();
                        newPassWordModal();
                    }
                });
            } else {
                $("#otpError").text(res.message);
            }
        },
        error: function () {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi kiểm tra OTP.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}


//function DoiMatKhauMoi() {
//    var mkMoi = $("#matKhauMoi_QMK").val().trim();
//    var mkXacNhan = $("#xacNhanMatKhauMoi_QMK").val().trim();

//    var isValid = true;

//    $("#matKhauMoi_QMKError").text("");
//    $("#xacNhanMatKhauMoi_QMKError").text("");

//    // Kiểm tra nhập trống
//    if (mkMoi === "") {
//        $("#matKhauMoi_QMKError").text("Vui lòng nhập mật khẩu mới.");
//        isValid = false;
//    }
//    if (mkXacNhan === "") {
//        $("#xacNhanMatKhauMoi_QMKError").text("Vui lòng xác nhận mật khẩu.");
//        isValid = false;
//    }
//    if (mkMoi !== "" && mkXacNhan !== "" && mkMoi !== mkXacNhan) {
//        $("#xacNhanMatKhauMoi_QMKError").text("Mật khẩu xác nhận không khớp.");
//        isValid = false;
//    }

//    if (!isValid) return;

//    // Gửi AJAX
//    $.ajax({
//        url: '/Customer/MailTest/ResetPassword',
//        type: 'POST',
//        data: { newPassword: mkMoi },
//        success: function (res) {
//            if (res.success) {
//                alert(res.message);
//                modalLogin()
//                newPassWordModal()

//            } else {
//                alert(res.message);
//            }
//        },
//        error: function () {
//            alert("Có lỗi xảy ra khi đổi mật khẩu.");
//        }
//    });
//}

function DoiMatKhauMoi() {
    var mkMoi = $("#matKhauMoi_QMK").val().trim();
    var mkXacNhan = $("#xacNhanMatKhauMoi_QMK").val().trim();

    var isValid = true;

    $("#matKhauMoi_QMKError").text("");
    $("#xacNhanMatKhauMoi_QMKError").text("");

    // Kiểm tra nhập trống
    if (mkMoi === "") {
        $("#matKhauMoi_QMKError").text("Vui lòng nhập mật khẩu mới.");
        isValid = false;
    }
    if (mkXacNhan === "") {
        $("#xacNhanMatKhauMoi_QMKError").text("Vui lòng xác nhận mật khẩu.");
        isValid = false;
    }
    if (mkMoi !== "" && mkXacNhan !== "" && mkMoi !== mkXacNhan) {
        $("#xacNhanMatKhauMoi_QMKError").text("Mật khẩu xác nhận không khớp.");
        isValid = false;
    }

    if (!isValid) return;

    // Gửi AJAX
    $.ajax({
        url: '/Customer/MailTest/ResetPassword',
        type: 'POST',
        data: { newPassword: mkMoi },
        success: function (res) {
            if (res.success) {
                Swal.fire({
                    title: 'Thành công!',
                    text: res.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        modalLogin();
                        newPassWordModal();
                    }
                });
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: res.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function () {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi đổi mật khẩu.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}


//modal xác nhận 
function confirmModal() {
    $("#modalCodeXacNhan").modal('toggle');
}

//modal xac nhận mật khẩu 
function newPassWordModal() {
    $("#modalNhapmatkhaumoi").modal('toggle');
}

//Modal các gói đăng ký
function cacGoiDangKyModal() {
    $("#modalCacGoiDangKy").modal('toggle');
}