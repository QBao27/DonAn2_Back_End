
document.addEventListener("DOMContentLoaded", function () {
    function validateInput(inputId, errorId, regex, errorMessage) {
        let input = document.getElementById(inputId);
        let errorSpan = document.getElementById(errorId);

        if (!input || !errorSpan) {
            console.error(`Không tìm thấy phần tử với ID: ${inputId} hoặc ${errorId}`);
            return () => false;
        }

        function checkValidation() {
            if (regex.test(input.value.trim())) {
                errorSpan.textContent = ""; // Ẩn lỗi nếu đúng
                return true;
            } else {
                errorSpan.textContent = errorMessage; // Hiển thị lỗi nếu sai
                return false;
            }
        }

        input.addEventListener("input", checkValidation);
        return checkValidation;
    }

    let checkHoten = validateInput("hoten", "error-hoten", /^[a-zA-ZÀ-ỹ\s]+$/, "Họ và tên không được chứa số hoặc ký tự đặc biệt!");
    let checkSdt = validateInput("sdt", "error-sdt", /^0\d{9}$/, "Số điện thoại phải có 10 số và bắt đầu bằng 0.");

    let ngayNhanInput = document.getElementById("myID");
    let errorNgayNhan = document.getElementById("error-ngaynhan");

    if (!ngayNhanInput || !errorNgayNhan) {
        console.error("Không tìm thấy phần tử myID hoặc error-ngaynhan.");
        return;
    }

    function checkNgayNhan() {
        if (ngayNhanInput.value) {
            errorNgayNhan.textContent = ""; // Ẩn lỗi nếu đã chọn ngày
            return true;
        } else {
            errorNgayNhan.textContent = "Vui lòng chọn ngày nhận!";
            return false;
        }
    }

    ngayNhanInput.addEventListener("input", checkNgayNhan);

    let btnDatSan = document.getElementById("btnDatSan");
    if (!btnDatSan) {
        console.error("Không tìm thấy nút btnDatSan.");
        return;
    }

    btnDatSan.addEventListener("click", function () {
        let isValid = checkHoten() & checkSdt() & checkNgayNhan();

        if (isValid) {
            showSweetAlert();

            document.getElementById("hoten").value = "";
            document.getElementById("sdt").value = "";
            ngayNhanInput.value = "";

            document.getElementById("error-hoten").textContent = "";
            document.getElementById("error-sdt").textContent = "";
            document.getElementById("error-ngaynhan").textContent = "";
        }
    });
});



// kết thúc kiểm tra
document.addEventListener("DOMContentLoaded", function () {
    let timeSelect = document.getElementById("timeSelect");
    let oneHourSection = document.getElementById("oneHour");
    let onePointFiveHourSection = document.getElementById("onePointFiveHour");

    function updateSelection() {
        let selectedValue = timeSelect.value;

        if (selectedValue === "1") {
            onePointFiveHourSection.style.pointerEvents = "none"; // Vô hiệu hóa 1.5 giờ
            onePointFiveHourSection.style.opacity = "0.5"; // Làm mờ

            oneHourSection.style.pointerEvents = "auto"; // Cho phép click 1 giờ
            oneHourSection.style.opacity = "1";
        } else {
            oneHourSection.style.pointerEvents = "none"; // Vô hiệu hóa 1 giờ
            oneHourSection.style.opacity = "0.5";

            onePointFiveHourSection.style.pointerEvents = "auto"; // Cho phép click 1.5 giờ
            onePointFiveHourSection.style.opacity = "1";
        }
    }

    timeSelect.addEventListener("change", updateSelection);
    updateSelection(); // Chạy ngay khi tải trang để cập nhật trạng thái ban đầu
});


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("timkiem"); // Ô input
    const text = "Tìm sân thể thao"; // Văn bản hiệu ứng
    let index = 0;
    let typingTimeout;
    let isTyping = true; // Kiểm soát trạng thái hiệu ứng

    function typeEffect() {
        if (!isTyping) return; // Nếu đang nhập liệu, dừng hiệu ứng

        if (index < text.length) {
            searchInput.setAttribute("placeholder", text.substring(0, index + 1)); // Hiển thị từng ký tự
            index++;
            typingTimeout = setTimeout(typeEffect, 200);
        } else {
            setTimeout(() => {
                searchInput.setAttribute("placeholder", ""); // Xóa văn bản sau 2s
                index = 0;
                typeEffect(); // Lặp lại hiệu ứng
            }, 2000);
        }
    }

    function startTypingEffect() {
        isTyping = true;
        index = 0;
        typeEffect();
    }

    function stopTypingEffect() {
        isTyping = false;
        clearTimeout(typingTimeout);
        searchInput.setAttribute("placeholder", ""); // Xóa placeholder khi nhập dữ liệu
    }

    // Bắt đầu hiệu ứng khi tải trang
    startTypingEffect();

    // Lắng nghe sự kiện nhập vào ô tìm kiếm
    searchInput.addEventListener("input", function () {
        if (this.value.trim() !== "") {
            stopTypingEffect();
        } else {
            startTypingEffect(); // Khi xóa hết nội dung, chạy lại hiệu ứng
        }
    });
});