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
        return isValid;
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