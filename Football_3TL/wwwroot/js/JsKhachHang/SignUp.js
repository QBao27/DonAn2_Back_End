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
        let fullName = $('#FullName').val().trim();
        let phone = $('#Phone').val().trim();
        let email = $('#Email').val().trim();
        let sanBongName = $('#SanBongName').val().trim();
        let password = $('#PassWord').val().trim();
        let confirmPassword = $("#passWordSignUp2").val().trim();
        let province = $('#diaChiTinh').val().trim();
        let district = $('#diaChiHuyen').val().trim();
        let commune = $('#diaChiXa').val().trim();
        let street = $('#diaChiCuThe').val().trim();
        let isValid = true;

        if(fullName === ''){
            $('#fullNameSignUpError').text("Bạn chưa nhập tên đăng nhập!");
            $('#FullName').addClass("input-error"); // Thêm class
            isValid = false;
        }
        if(phone === ''){
            $('#phoneSignUpError').text("Bạn chưa nhập số điện thoại!");
            $('#Phone').addClass("input-error"); // Thêm class
            isValid = false;
        }
        if(email === ''){
            $('#emailSignUpError').text("Bạn chưa nhập email!");
            $('#Email').addClass("input-error"); // Thêm class
            isValid = false;
        }
        if(sanBongName === ''){
            $('#sanBongNameSignUpError').text("Bạn chưa nhập tên sân bóng!");
            $('#SanBongName').addClass("input-error"); // Thêm class
            isValid = false;
        }
        if(password === ''){
            $('#passWordSignUpError').text("Bạn chưa nhập mật khẩu!");
            $('#PassWord').addClass("input-error"); // Thêm class
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
            $("#Email").addClass("input-error");
            isValid = false;
        }

        // Kiểm tra số điện thoại hợp lệ (10 số, chỉ chứa chữ số)
        let phonePattern = /^[0-9]{10}$/;
        if (phone && !phonePattern.test(phone)) {
            $("#phoneSignUpError").text("Số điện thoại không hợp lệ!");
            $("#Phone").addClass("input-error");
            isValid = false;
        }

        if(password.length > 0 && password.length < 6){
            $('#passWordSignUpError').text("Mật khẩu phải có ít nhất 6 ký tự!");
            $('#PassWord').addClass("input-error");
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
            let formData = $('#DangKyTK').serialize(); // Lấy toàn bộ dữ liệu form

            $.post('/Customer/Account/CreateDangKyPaymentUrl', formData, function (res) {
                if (res.success) {
                    window.location.href = res.url;
                } else {
                    toastr.warning(res.message);
                }
            });
        }

        return isValid;
}



    //reset thông báo lỗi đăng ký
    function resetErrorSignUp() {
        $("#fullNameSignUpError, #phoneSignUpError, #emailSignUpError, #sanBongNameSignUpError, #passWordSignUpError, #passWordSignUp2Error, #diaChiTinhError, #diaChiHuyenError, #diaChiXaError, #diaChiCuTheError").text('');
        $("#FullName, #Phone, #Email, #SanBongName, #PassWord, #passWordSignUp2, #diaChiTinh, #diaChiHuyen, #diaChiXa, #diaChiCuThe").removeClass("input-error");
    }

    //reset thong tin đăng ký
    function resetDataSignUp() {
        $("#FullName, #Phone, #Email, #SanBongName, #PassWord, #passWordSignUp2, #diaChiTinh, #diaChiHuyen, #diaChiXa, #diaChiCuThe").val('');
        resetErrorSignUp();
    }

    //đóng mở modal đăng ký
    function modalSignUp() {
        $('#modalDangKy').modal('toggle');
        resetDataSignUp();
}

const errorMap = {
    "FullName": "fullNameSignUpError",
    "Phone": "phoneSignUpError",
    "Email": "emailSignUpError",
    "SanBongName": "sanBongNameSignUpError",
    "PassWord": "passWordSignUpError",
    "passWordSignUp2": "passWordSignUp2Error",
    "diaChiTinh": "diaChiTinhError",
    "diaChiHuyen": "diaChiHuyenError",
    "diaChiXa": "diaChiXaError",
    "diaChiCuThe": "diaChiCuTheError"
};

    //Khi trang tải xong thì mới chạy
$("#FullName, #Phone, #Email, #SanBongName, #PassWord, #passWordSignUp2, #diaChiTinh, #diaChiHuyen, #diaChiXa, #diaChiCuThe").on("focus", function () {
    $(this).removeClass("input-error");
    $("#" + errorMap[this.id]).text('');
});

// Hàm post thông tin đăng ký
//function SignUp() {
//    let fullName = $('#fullNameSignUp').val().trim();
//    let phone = $('#phoneSignUp').val().trim();
//    let email = $('#emailSignUp').val().trim();
//    let sanBong = $('#sanBongNameSignUp').val().trim();
//    let password = $('#passWordSignUp').val().trim();
//    let confirmPassword = $('#passWordSignUp2').val().trim();
//    let tinh = $('#diaChiTinh option:selected').text().trim();
//    let huyen = $('#diaChiHuyen option:selected').text().trim();
//    let xa = $('#diaChiXa option:selected').text().trim();
//    let diaChiCuThe = $('#diaChiCuThe').val().trim();

//    let requestData = {
//        FullName: fullName,
//        Phone: phone,
//        Email: email,
//        NameSanBong: sanBong,
//        Password: password,
//        ConfirmPassword: confirmPassword,
//        Province: tinh,
//        District: huyen,
//        Communes: xa,
//        PecificAddress: diaChiCuThe
//    };

//    // Vô hiệu hóa nút đăng ký
//    $('#btnSignUp').prop("disabled", true).text("Đang đăng ký...");

//    $.ajax({
//        url: "/Customer/Account/SignUp",
//        type: "POST",
//        contentType: "application/json",
//        headers: { "Accept": "application/json" },
//        data: JSON.stringify(requestData),
//        success: function (response) {
//            if (response.success) {
//                toastr.success(response.message, "", {
//                    timeOut: 2000 // Giới hạn thời gian hiển thị là 1 giây
//                });
//                modalSignUp(); // Ẩn modal đăng ký
//                modalLogin(); // Hiển thị modal đăng nhập
//            } else {
//                    toastr.error(response.message, "", {
//                        timeOut: 2000 // Giới hạn thời gian hiển thị là 1 giây
//                    });
//                    resetDataSignUp();
//                }
//        },
//        error: function (e) {
//            console.error("Lỗi:", e.status);
//        },
//        complete: function () {
//            // Kích hoạt lại nút đăng ký sau khi xử lý xong
//            $('#btnSignUp').prop("disabled", false).text("Đăng ký");
//        }
//    });
//}

//$('#btnSignUp').click(function (e) {
//    e.preventDefault();

//    var model = {
//        FullName: $('#FullName').val(),
//        Phone: $('#Phone').val(),
//        Email: $('#Email').val(),
//        SanBongName: $('#SanBongName').val(),
//        DiaChiTinh: $('#DiaChiTinh').val(),
//        DiaChiHuyen: $('#DiaChiHuyen').val(),
//        DiaChiXa: $('#DiaChiXa').val(),
//        DiaChiCuThe: $('#DiaChiCuThe').val(),
//        MaGoi: $('#MaGoi').val(),
//        SoTien: $('#SoTien').val()
//    };

//    $.ajax({
//        url: '/Customer/Account/CreateDangKyPaymentUrl',
//        type: 'POST',
//        data: model,
//        success: function (result) {
//            if (result.success) {
//                window.location.href = result.url; // Chuyển sang VNPay
//            } else {
//                toastr.warning(result.message, "", { timeOut: 2000 }); // Thông báo lỗi
//            }
//        },
//        error: function () {
//            toastr.error("Có lỗi xảy ra!", "", { timeOut: 2000 }); // Lỗi AJAX
//        }
//    });
//});

function formatVND(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}
$('#modalCacGoiDangKy').on('show.bs.modal', function () {
    $.ajax({
        url: "/ChuSanBong/GoiDangKy/GetAllGoiDangKy",
        type: 'GET',
        success: function (data) {
            renderGoiDangKy(data);
        },
        error: function () {
            alert('Không tải được gói đăng ký.');
        }
    });
});

function renderGoiDangKy(data) {
    const $list = $('#listGoiDangKy');
    $list.empty();

    let html = '';
    for (let i = 0; i < data.length; i++) {
        if (i % 2 === 0) {
            if (i !== 0) html += '</div>';
            html += '<div class="row mt-3">';
        }

        html += `
                <div class="col-6">
                    <button type="button"
                            class="btn text-light btn-lg w-100 py-3 shadow btn-chon-goi"
                            style="background-color: rgb(20, 34, 56); border-radius: 10px;"
                            data-ma-goi="${data[i].maGoi}"
                            data-thoi-han="${data[i].thoiHan}"
                            data-gia="${data[i].gia}">
                        <input type="hidden" class="MaGoi" value="${data[i].maGoi}" />
                        <div class="fw-bold">Gói ${data[i].thoiHan} tháng</div>
                        <div class="Gia">${formatVND(data[i].gia)} VND</div>
                    </button>
                </div>
            `;
    }
    html += '</div>';
    $list.append(html);
}

$(document).on('click', '.btn-chon-goi', function () {
    var maGoi = $(this).data('ma-goi');
    var thoiHan = $(this).data('thoi-han');
    var gia = $(this).data('gia');

    // Gán giá trị qua modal đăng ký
    $('#thongTinGoi').text(`Gói: ${formatVND(gia)} VND / ${thoiHan} tháng`);
    $('#MaGoi').val(maGoi);
    $('#SoTien').val(gia);

    // Ẩn modal chọn gói, mở modal đăng ký
    $('#modalCacGoiDangKy').modal('hide');
    $('#modalDangKy').modal('show');
});
