$(document).ready(function () {
    $("#btnShow").click(function () {
        $("#modalDangKy").show(); // Hiển thị phần tử có id=myDiv
    });    
    $("#diaChiTinh", "#diaChiHuyen").select2(); // Kích hoạt Select2
    // Lấy danh sách tỉnh/thành
    $.get("https://provinces.open-api.vn/api/?depth=1")
        .done(function (data) {
            let object = '<option value="">-- Tỉnh Thành --</option>';  // Khởi tạo chuỗi rỗng để lưu các <option>
            $("#diaChiHuyen").empty().append('<option value="">-- Quận Huyện --</option>');
            $("#diaChiXa").empty().append('<option value="">-- Xã Phường --</option>');
            $.each(data, function (index, province) { // Sử dụng (index, province) thay vì (item)
                object += `
                <option value="${province.code}">${province.name}</option>
            `;
            });
            $('#diaChiTinh').html(object); // Gán danh sách tỉnh vào <select>
        })
        .fail(function () {
            console.error("Không thể tải danh sách tỉnh thành");
        });

    // Khi chọn tỉnh, lấy danh sách quận/huyện
    $("#diaChiTinh").change(function () {
        $("#diaChiHuyen").empty().append('<option value="">-- Quận huyện --</option>');
        $("#diaChiXa").empty().append('<option value="">-- Xã Phường --</option>');
        let provinceCode = $(this).val();
        if (provinceCode) {
            $.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
                .done(function (data) {
                    $("#diaChiHuyen").append(data.districts.map(district =>
                        `<option value="${district.code}">${district.name}</option>`
                    ));
                })
                .fail(function () {
                    console.error("Không thể tải danh sách quận huyện");
                });
        }
    });

    // Khi chọn quận/huyện, lấy danh sách xã/phường
    $("#diaChiHuyen").change(function () {
        $("#diaChiXa").empty().append('<option value="">-- Xã Phường --</option>');
        let districtCode = $(this).val();
        if (districtCode) {
            $.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
                .done(function (data) {
                    $("#diaChiXa").append(data.wards.map(ward =>
                        `<option value="${ward.code}">${ward.name}</option>`
                    ));
                })
                .fail(function () {
                    console.error("Không thể tải danh sách xã phường");
                });
        }
    });
});


//ham kiem tra thong tin dang Ký
function checkDataSignUp() {
    let fullName = $('#fullNameSignUp').val().trim();
    let phone = $('#phoneSignUp').val().trim();
    let email = $('#emailSignUp').val().trim();
    let sanBongName = $('#sanBongNameSignUp').val().trim();
    let password = $('#passWordSignUp').val().trim();
    let confirmPassword = $("#passWordSignUp2").val().trim();
    let province  = $('#diaChiTinh').val().trim();
    let district = $('#diaChiHuyen').val().trim();
    let commune = $('#diaChiXa').val().trim();
    let street = $('#diaChiCuThe').val().trim();
    let isValid = true;

    if(fullName === ''){
        $('#fullNameSignUpError').text("Bạn chưa nhập tên đăng nhập!");
        $('#fullNameSignUp').addClass("input-error"); // Thêm class
        isValid = false;
    }
    if(phone === ''){
        $('#phoneSignUpError').text("Bạn chưa nhập số điện thoại!");
        $('#phoneSignUp').addClass("input-error"); // Thêm class
        isValid = false;
    }
    if(email === ''){
        $('#emailSignUpError').text("Bạn chưa nhập email!");
        $('#emailSignUp').addClass("input-error"); // Thêm class
        isValid = false;
    }
    if(sanBongName === ''){
        $('#sanBongNameSignUpError').text("Bạn chưa nhập tên sân bóng!");
        $('#sanBongNameSignUp').addClass("input-error"); // Thêm class
        isValid = false;
    }
    if(password === ''){
        $('#passWordSignUpError').text("Bạn chưa nhập mật khẩu!");
        $('#passWordSignUp').addClass("input-error"); // Thêm class
        isValid = false;
    }
    if(confirmPassword === ''){
        $('#passWordSignUp2Error').text("Bạn chưa xác nhận mật khẩu!");
        $('#passWordSignUp2').addClass("input-error"); // Thêm class
        isValid = false;
    }
    if(province === ''){
        $('#diaChiTinhError').text("Bạn chưa chọn địa chỉ!");
        $('#diaChiTinh').addClass("input-error"); // Thêm class
        isValid = false;
    }
    if(district === ''){
        $('#diaChiHuyenError').text("Bạn chưa chọn địa chỉ!");
        $('#diaChiHuyen').addClass("input-error"); // Thêm class
        isValid = false;
    }
    if(commune === ''){
        $('#diaChiXaError').text("Bạn chưa chọn địa chỉ!");
        $('#diaChiXa').addClass("input-error"); // Thêm class
        isValid = false;
    }
    if(street === ''){
        $('#diaChiCuTheError').text("Bạn chưa chọn địa chỉ!");
        $('#diaChiCuThe').addClass("input-error"); // Thêm class
        isValid = false;
    }
    
    // Kiểm tra email hợp lệ
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
        $("#emailSignUpError").text("Email không hợp lệ!");
        $("#emailSignUp").addClass("input-error");
        isValid = false;
    }

    // Kiểm tra số điện thoại hợp lệ (10 số, chỉ chứa chữ số)
    let phonePattern = /^[0-9]{10}$/;
    if (phone && !phonePattern.test(phone)) {
        $("#phoneSignUpError").text("Số điện thoại không hợp lệ!");
        $("#phoneSignUp").addClass("input-error");
        isValid = false;
    }

    if(password.length > 0 && password.length < 6){
        $('#passWordSignUpError').text("Mật khẩu phải có ít nhất 6 ký tự!");
        $('#passWordSignUp').addClass("input-error");
        isValid = false;
    }

    // Kiểm tra mật khẩu trùng khớp
    if (password && confirmPassword && password !== confirmPassword) {
        $("#passWordSignUp2Error").text("Mật khẩu không khớp!");
        $("#passWordSignUp2").addClass("input-error");
        isValid = false;
    }

    if(!isValid){
        toastr.warning("Bạn chưa nhập thông tin!", "", { 
            timeOut: 1000 // Giới hạn thời gian hiển thị là 1 giây
        });
    }

    if (isValid) {
        SignUp();
    }

    return isValid;
}

//reset thông báo lỗi đăng ký
function resetErrorSignUp() {
    $("#fullNameSignUpError, #phoneSignUpError, #emailSignUpError, #sanBongNameSignUpError, #passWordSignUpError, #passWordSignUp2Error, #diaChiTinhError, #diaChiHuyenError, #diaChiXaError, #diaChiCuTheError").text('');
    $("#fullNameSignUp, #phoneSignUp, #emailSignUp, #sanBongNameSignUp, #passWordSignUp, #passWordSignUp2, #diaChiTinh, #diaChiHuyen, #diaChiXa, #diaChiCuThe").removeClass("input-error");
}

//reset thong tin đăng ký
function resetDataSignUp() {
    $("#fullNameSignUp, #phoneSignUp, #emailSignUp, #sanBongNameSignUp, #passWordSignUp, #passWordSignUp2, #diaChiTinh, #diaChiHuyen, #diaChiXa, #diaChiCuThe").val('');
    resetErrorSignUp();
}

//đóng mở modal đăng ký
function modalSignUp() {
    $('#modalDangKy').modal('toggle');
    resetDataSignUp();
}

//Khi trang tải xong thì mới chạy
$(document).ready(function () {
    //focus vào thì xóa thong báo lỗi
    $("#fullNameSignUp, #phoneSignUp, #emailSignUp, #sanBongNameSignUp, #passWordSignUp, #passWordSignUp2, #diaChiTinh, #diaChiHuyen, #diaChiXa, #diaChiCuThe").on("focus", function () {
        $(this).removeClass("input-error");
        $("#" + this.id + "Error").text('');
    });
})

// Hàm post thông tin đăng ký
function SignUp() {
    let fullName = $('#fullNameSignUp').val().trim();
    let phone = $('#phoneSignUp').val().trim();
    let email = $('#emailSignUp').val().trim();
    let sanBong = $('#sanBongNameSignUp').val().trim();
    let password = $('#passWordSignUp').val().trim();
    let confirmPassword = $('#passWordSignUp2').val().trim();
    let tinh = $('#diaChiTinh option:selected').text().trim();
    let huyen = $('#diaChiHuyen option:selected').text().trim();
    let xa = $('#diaChiXa option:selected').text().trim();
    let diaChiCuThe = $('#diaChiCuThe').val().trim();

    let requestData = {
        FullName: fullName,
        Phone: phone,
        Email: email,
        NameSanBong: sanBong,
        Password: password,
        ConfirmPassword: confirmPassword,
        Province: tinh,
        District: huyen,
        Communes: xa,
        PecificAddress: diaChiCuThe
    };

    // Vô hiệu hóa nút đăng ký
    $('#btnSignUp').prop("disabled", true).text("Đang đăng ký...");

    $.ajax({
        url: "/KhachHang/Account/SignUp",
        type: "POST",
        contentType: "application/json",
        headers: { "Accept": "application/json" },
        data: JSON.stringify(requestData),
        success: function (response) {
            if (response.success) {
                toastr.success(response.message, "", {
                    timeOut: 2000 // Giới hạn thời gian hiển thị là 1 giây
                });
                modalSignUp(); // Ẩn modal đăng ký
                modalLogin(); // Hiển thị modal đăng nhập
            } else {
                if (response.startLogin) {
                    toastr.warning(response.message, "", {
                        timeOut: 2000 // Giới hạn thời gian hiển thị là 1 giây
                    });
                    modalSignUp(); // Ẩn modal đăng ký
                    modalLogin(); // Hiển thị modal đăng nhập
                    $('#taiKhoanDangNhap').val(response.emailLogin)
                }
                else {
                    toastr.error(response.message, "", {
                        timeOut: 2000 // Giới hạn thời gian hiển thị là 1 giây
                    });
                    resetDataSignUp();
                }
            }
        },
        error: function (e) {
            console.error("Lỗi:", e.status);
        },
        complete: function () {
            // Kích hoạt lại nút đăng ký sau khi xử lý xong
            $('#btnSignUp').prop("disabled", false).text("Đăng ký");
        }
    });
}
