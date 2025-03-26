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