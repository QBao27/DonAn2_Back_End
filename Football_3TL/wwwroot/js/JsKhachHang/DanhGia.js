function clearDataAssessInput() {
    const inputFields = document.getElementsByClassName('Assess');
    Array.from(inputFields).forEach((input) => {
        input.value = '';
    });
}
// <!-- xoa so sao -->
function clearStarAssess() {
    const radioOptions = document.getElementsByClassName('star');
    Array.from(radioOptions).forEach((radio) => {
        radio.checked = false;
    });
}

//ham xoa so dien thoại danh gia
function clearPhoneNumberDanhGia() {
    const NumberInput = document.getElementById('PhoneNumberAssess');
    NumberInput.value = '';
}

//Reset thong bao lỗi
function resetError(){
    const fullNameError = document.getElementById('fullNameError'); // Phần tử thông báo lỗi cho họ tên
    const phoneNumberError = document.getElementById('phoneNumberError'); // Phần tử thông báo lỗi cho số điện thoại
    const starRatingError = document.getElementById('starRatingError'); // Phần tử thông báo lỗi cho đánh giá sao

    fullNameError.textContent = '';
    phoneNumberError.textContent = '';
    starRatingError.textContent = '';
}
//Kiem tra nhap thong tin trong chuc nang danh gia
function validateAssessmentForm() {
    // Lấy giá trị của họ tên
    const fullName = document.getElementById('fullNameAssess').value.trim();
    const fullNameError = document.getElementById('fullNameError'); // Phần tử thông báo lỗi cho họ tên

    // Lấy giá trị của số điện thoại
    const phoneNumber = document.getElementById('PhoneNumberAssess').value.trim();
    const phoneNumberError = document.getElementById('phoneNumberError'); // Phần tử thông báo lỗi cho số điện thoại

    // Kiểm tra xem có radio nào được chọn cho phần đánh giá sao hay không
    const starRating = document.querySelector('input[name="rating"]:checked');
    const starRatingError = document.getElementById('starRatingError'); // Phần tử thông báo lỗi cho đánh giá sao

    // Biểu thức chính quy để kiểm tra số điện thoại (10 chữ số)
    const phoneRegex = /^[0-9]{10}$/;

    // Reset các thông báo lỗi trước khi kiểm tra
    resetError();

    // Biến cờ để theo dõi trạng thái hợp lệ của form
    let isValid = true;

    // Kiểm tra xem họ tên đã được nhập chưa
    if (fullName === "") {
        fullNameError.textContent = "Vui lòng nhập họ tên của bạn.";
        isValid = false;
    }
    // Kiểm tra xem số điện thoại đã được nhập và hợp lệ chưa
    if (phoneNumber === "" || !phoneRegex.test(phoneNumber)) {
        phoneNumberError.textContent = "Vui lòng nhập số điện thoại hợp lệ (10 chữ số).";
        isValid = false;
    }

    // Kiểm tra xem người dùng có chọn số sao hay chưa
    if (!starRating) {
        starRatingError.textContent = "Vui lòng chọn số sao để đánh giá khách sạn.";
        isValid = false;
    }

    // Nếu có lỗi, không tiếp tục thực hiện
    if (!isValid) {
        return false;
    }

    // ThemDanhGia();
    return true;
}

function showSweetAlertDG() {
    Swal.fire({
        title: 'Thành công!',
        text: 'Cảm ơn bạn đã đánh giá!.',
        icon: 'success', // success, error, warning, info, question
        confirmButtonText: 'OK',
        customClass: {
            popup: 'custom-swal'
        }
    });
}


// Thêm sự kiện focus để ẩn thông báo lỗi khi nhấp vào ô nhập
document.getElementById('fullNameAssess').addEventListener('focus', function () {
    document.getElementById('fullNameError').textContent = '';
});

document.getElementById('PhoneNumberAssess').addEventListener('focus', function () {
    document.getElementById('phoneNumberError').textContent = '';
});

const starInputs = document.querySelectorAll('input[name="rating"]');
starInputs.forEach(function (input) {
    input.addEventListener('change', function () {
        document.getElementById('starRatingError').textContent = '';
    });
});

function loadDanhGia(maChuSan) {
    $.ajax({
        url: '/Customer/DanhGia/GetDanhGiaByMaChuSan?maChuSan=' + maChuSan,
        type: 'GET',
        success: function (data) {
            var html = '';
            data.forEach(function (item) {
                html += `
                        <div>
                            <p>
                                <b><span>${item.hoTen}</span> :</b> 
                                <b>
                                    <span class="text-warning">
                                        <span>${item.soSao}</span> sao
                                    </span>
                                </b>
                            </p>
                            <p class="text-break">
                                Đánh giá: "<span>${item.noiDung}</span>"
                            </p>
                            <p class="text-muted" style="font-size: 0.9rem;">
                                Thời gian: <span>${item.thoiGian ? item.thoiGian.substring(0, 5) : ''}</span>
                            </p>
                            <hr style="border: none;border-top: 1px dashed #ccc;">
                        </div>
                    `;
            });

            $('#bodyDanhGia').html(html);
        },
        error: function () {
            alert('Không tải được đánh giá!');
        }
    });
}

$(document).ready(function () {
    var maChuSan = $('#MaChuSan').val();
    loadDanhGia(maChuSan);
});

// Khởi tạo modal 1 lần lúc load trang
var modalDanhGia = new bootstrap.Modal(document.getElementById('modalDanhGia'));
document.getElementById('btnOpenModalDanhGia').addEventListener('click', function () {
    modalDanhGia.show();
});

//function submitAssessmentForm() {
//    if (!validateAssessmentForm()) {
//        return; // Nếu validate fail thì không gửi
//    }

//    var fullName = $("#fullNameAssess").val().trim();
//    var phoneNumber = $("#PhoneNumberAssess").val().trim();
//    var content = $("#ContentAssess").val().trim();
//    var rating = $('input[name="rating"]:checked').val();
//    var maChuSan = $("#MaChuSan").val();
    

//    $.ajax({
//        url: '/Customer/DanhGia/Create',
//        type: 'POST',
//        data: {
//            FullName: fullName,
//            PhoneNumber: phoneNumber,
//            Content: content,
//            Rating: rating,
//            MaChuSan: maChuSan
//        },
//        success: function (response) {
//            if (response.success) {

//                modalDanhGia.hide(); // Ẩn modal
             
//                clearDataAssessInput(); // Xóa input
//                clearStarAssess();      // Xóa sao
//                resetError();           // Xóa lỗi
//                loadDanhGia(maChuSan);
//                tinhTrungBinhSao();
//                demDanhGia();
//                DemDanhGia5()
//                showSweetAlertDG();
                
//            } else {
//                alert('Gửi đánh giá thất bại. Vui lòng thử lại.');
//            }
//        },
//        error: function (xhr, status, error) {
//            console.error(error);
//            alert('Có lỗi xảy ra khi gửi đánh giá.');
//        }
//    });
//}

function submitAssessmentForm() {
    if (!validateAssessmentForm()) {
        return; // Nếu validate fail thì không gửi
    }

    var fullName = $("#fullNameAssess").val().trim();
    var phoneNumber = $("#PhoneNumberAssess").val().trim();
    var content = $("#ContentAssess").val().trim();
    var rating = $('input[name="rating"]:checked').val();
    var maChuSan = $("#MaChuSan").val();  // Lấy đúng từ thẻ hidden

    $.ajax({
        url: '/Customer/DanhGia/Create',
        type: 'POST',
        data: {
            FullName: fullName,
            PhoneNumber: phoneNumber,
            Content: content,
            Rating: rating,
            MaChuSan: maChuSan
        },
        success: function (response) {
            if (response.success) {
                modalDanhGia.hide(); // Ẩn modal
                clearDataAssessInput(); // Xóa input
                clearStarAssess();      // Xóa sao
                resetError();           // Xóa lỗi
                loadDanhGia(maChuSan);
                tinhTrungBinhSao();
                demDanhGia();
                DemDanhGia5();
                showSweetAlertDG();     // Thông báo thành công
            } else {
                // Thay alert bằng SweetAlert2 đẹp hơn
                Swal.fire({
                    icon: 'error',
                    title: 'Không thể đánh giá',
                    text: response.message
                });
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi hệ thống',
                text: 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.'
            });
        }
    });
}

function tinhTrungBinhSao() {
    var maChuSan = $('#MaChuSan').val(); // Lấy id chủ sân

    $.ajax({
        url: '/Customer/DanhGia/TinhTrungBinhSao', // đổi đúng tên controller nha
        type: 'GET',
        data: { maChuSan: maChuSan },
        success: function (response) {
            if (response.success) {
                $('#averageRating').text(response.soSaoTrungBinh);
                $('#averageRating1').text(response.soSaoTrungBinh);
                renderStars();
            } else {
                $('#averageRating').text('0');
                renderStars();
            }
        },
        error: function () {
            $('#averageRating').text('0');
            alert('Có lỗi khi tính trung bình sao');
            renderStars();
        }
    });
}

function demDanhGia() {
    var maChuSan = $('#MaChuSan').val(); // Lấy id chủ sân

    $.ajax({
        url: '/Customer/DanhGia/DemDanhGia',
        type: 'GET',
        data: { maChuSan: maChuSan },
        success: function (response) {
            // response chính là số lượng đánh giá
            $('#totalReviews').text(response);
            $('#totalReviews2').text(response);
            $('#totalReviews3').text(response);

        },
        error: function (xhr) {
            console.error('Lỗi khi lấy số lượng đánh giá:', xhr.responseText);
        }
    });
}
tinhTrungBinhSao();
demDanhGia();
DemDanhGia5()

function DemDanhGia5() {
    var maChuSan = $('#MaChuSan').val();

    $.ajax({
        url: '/Customer/DanhGia/DemDanhGia5',
        type: 'GET',
        data: { maChuSan: maChuSan },
        success: function (response) {
            // response là object kiểu { "5": 10, "4": 7, ... }
            $('#fiveStarCount').text(response[5] || 0);
            $('#fourStarCount').text(response[4] || 0);
            $('#threeStarCount').text(response[3] || 0);
            $('#twoStarCount').text(response[2] || 0);
            $('#oneStarCount').text(response[1] || 0);
        },
        error: function (xhr) {
            console.error(xhr.responseText);
        }
    });
}

function GetImages() {
    var maChuSan = $('#MaChuSan').val(); // 👉 lấy MaChuSan từ input ẩn
    console.log("MaChuSan gửi đi:", maChuSan);

    $.ajax({
        url: "/Customer/DanhGia/GetHinhAnh?maChuSan=" + maChuSan,
        type: "GET",
        success: function (response) {
            console.log("Response server trả về:", response);

            if (response.success) {
                if (Array.isArray(response.data)) {
                    response.data.forEach(img => {
                        console.log(`Gán ảnh: ${img.imgIndex} => ${img.hinhAnh}`);
                        if (img.imgIndex && img.hinhAnh) {
                            $(`#${img.imgIndex}`).attr('src', img.hinhAnh);
                        }
                    });
                } else {
                    console.warn("Dữ liệu data không phải mảng!");
                }
            } else {
                toastr.warning(response.message);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Có lỗi xảy ra khi lấy hình ảnh sân.");
            console.error("XHR:", xhr);
            console.error("Status:", status);
            console.error("Error:", error);
        }
    });
}

GetImages()


function GetGioMoDongCua() {
    var maChuSan = $('#MaChuSan').val();
    console.log("Gửi MaChuSan:", maChuSan);

    $.ajax({
        url: "/Customer/DanhGia/GetGioMoDongCua?maChuSan=" + maChuSan,
        type: "GET",
        success: function (response) {
            console.log("Response giờ mở/đóng:", response);

            if (response.success) {
                $('#GioMoCua').text(response.data.gioMoCua);
                $('#GioDongCua').text(response.data.gioDongCua);
            } else {
                toastr.warning(response.message);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Lỗi khi lấy giờ mở/đóng cửa.");
            console.error(xhr, status, error);
        }
    });
}

GetGioMoDongCua()


function GetSoLuongSan() {
    var maChuSan = $('#MaChuSan').val();
    console.log("Gửi MaChuSan:", maChuSan);

    $.ajax({
        url: "/Customer/DanhGia/GetSoLuongSan?maChuSan=" + maChuSan,
        type: "GET",
        success: function (response) {
            console.log("Response số sân:", response);

            if (response.success) {
                $('#SoSan').text(response.soSan);
            } else {
                toastr.warning(response.message);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Lỗi khi lấy số lượng sân.");
            console.error(xhr, status, error);
        }
    });
}

GetSoLuongSan()


function GetThongTinChuSan() {
    var maChuSan = $('#MaChuSan').val(); // 👈 Lấy từ input hidden
    console.log("Gửi MaChuSan:", maChuSan);

    $.ajax({
        url: "/Customer/DanhGia/GetThongTinChuSan?maChuSan=" + maChuSan,
        type: "GET",
        success: function (response) {
            console.log("Thông tin chủ sân:", response);

            if (response.success) {
                $('#TenSanBong').text(response.tenSanBong);
                $('#DiaChi').text(response.diaChi);
            } else {
                toastr.warning(response.message);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Có lỗi khi lấy thông tin chủ sân.");
            console.error(xhr, status, error);
        }
    });
}

GetThongTinChuSan();

function renderStars() {
    var rawValue = document.getElementById('averageRating').textContent.trim().replace(',', '.');
    var averageRating = parseFloat(rawValue);

    if (isNaN(averageRating)) {
        console.warn("⚠️ Không thể parse rating:", rawValue);
        return;
    }

    var roundedRating = Math.round(averageRating); // hoặc Math.ceil / Math.floor nếu bạn muốn

    var stars = document.querySelectorAll('.saoTrungBinh');
    stars.forEach(function (star, index) {
        if (index < roundedRating) {
            star.classList.add('text-warning');
        } else {
            star.classList.remove('text-warning');
        }
    });
}



