
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


$(document).ready(function () {
    var maChuSan = $('#MaChuSan').val();

    $.ajax({
        url: '/Customer/DatSan/GetGioMoCua?maChuSan=' + maChuSan,
        type: 'GET',
        success: function (data) {
            var gioMo = data.gioMoCua;
            var gioDong = data.gioDongCua;

            var html = '';

            var now = new Date();
            var currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

            for (var i = gioMo * 2; i < gioDong * 2; i++) {
                var startHour = Math.floor(i / 2);
                var startMin = (i % 2 === 0) ? 0 : 30;

                var endTotal = i + 2;
                var endHour = Math.floor(endTotal / 2);
                var endMin = (endTotal % 2 === 0) ? 0 : 30;

                var startTimeStr = startHour.toString().padStart(2, '0') + ":" + (startMin === 0 ? "00" : "30");
                var endTimeStr = (endHour % 24).toString().padStart(2, '0') + ":" + (endMin === 0 ? "00" : "30");

                var slotStartMinutes = startHour * 60 + startMin;

                var isPast = slotStartMinutes <= currentTimeMinutes;

                html += `
        <div class="col-6 col-md-4 col-lg-3 p-1 hower-giodat">
          <div id="time-slot-container">
            <div class="giodat p-2 d-flex flex-column align-items-center ${isPast ? 'disabled-slot' : ''}" ${isPast ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                <div class="fw-bold">${startTimeStr} - ${endTimeStr}</div>
            </div>
           </div>
        </div>
    `;
            }

            $('#khungGioContainer').html(html);

            $('#khungGioContainer').on('click', '.giodat', function () {
                const timeText = $(this).find('.fw-bold').text();
                console.log("Giờ được chọn:", timeText);

                // Hiện lên phần hiển thị
                $('#time-value').text(timeText);

                // Xóa lớp chọn cũ, thêm lớp mới
                $('.giodat').removeClass('selected-slot');
                $(this).addClass('selected-slot');
            });
        },
        error: function () {
            alert("Lỗi khi tải giờ mở cửa.");
        }
    });
});


$(document).ready(function () {
    var maChuSan = $('#MaChuSan').val();

    $.ajax({
        url: '/Customer/DatSan/GetGioMoCua?maChuSan=' + maChuSan,
        type: 'GET',
        success: function (data) {
            var gioMo = data.gioMoCua;  // ví dụ: 6
            var gioDong = data.gioDongCua; // ví dụ: 22

            var html = '';

            var now = new Date();
            var currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

            // duyệt từng khung 30 phút, nhưng hiển thị mỗi lần 1.5 giờ = 90 phút
            for (var i = gioMo * 60; i <= (gioDong * 60 - 90); i += 30) {
                var startHour = Math.floor(i / 60);
                var startMin = i % 60;

                var endMinutes = i + 90;
                var endHour = Math.floor(endMinutes / 60);
                var endMin = endMinutes % 60;

                var startTimeStr = startHour.toString().padStart(2, '0') + ":" + startMin.toString().padStart(2, '0');
                var endTimeStr = endHour.toString().padStart(2, '0') + ":" + endMin.toString().padStart(2, '0');

                var isPast = i <= currentTimeMinutes;

                html += `
        <div class="col-6 col-md-4 col-lg-3 p-1 hower-giodat">
            <div id="time-slot-container">
              <div class="giodat p-2 d-flex flex-column align-items-center ${isPast ? 'disabled-slot' : ''}" ${isPast ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                <div class="fw-bold">${startTimeStr} - ${endTimeStr}</div>
              </div>
            </div>
        </div>
    `;
            }

            $('#KhungGioDatle').html(html); // ⚠️ container mới bạn yêu cầu

            $('#KhungGioDatle').on('click', '.giodat', function () {
                const timeText = $(this).find('.fw-bold').text();
                console.log("Giờ được chọn:", timeText);

                // Hiện lên phần hiển thị
                $('#time-value').text(timeText);

                // Xóa lớp chọn cũ, thêm lớp mới
                $('.giodat').removeClass('selected-slot');
                $(this).addClass('selected-slot');
            });
        },
        error: function () {
            alert("Lỗi khi tải giờ mở cửa.");
        }
    });
});


function fetchSanTrong() {
    const ngayDat = $('#myID').val();
    console.log(ngayDat)
    const timeRange = $('#time-value').val() || $('#time-value').text();
    const gioBatDau = timeRange.split('-')[0].trim();
    const maChuSan = $('#MaChuSan').val();

    if (!ngayDat || !gioBatDau) return;

    $.ajax({
        url: '/Customer/DatSan/GetSanTrong',
        type: 'GET',
        data: {
            ngayDat: ngayDat,
            gioBatDau: gioBatDau,
            maChuSan: maChuSan
        },
        success: function (result) {
            console.log(result)
            var select = $('#selectSan');
            select.empty();

            if (result.length === 0) {
                select.append('<option value="">Không có sân trống</option>');
            } else {
                result.forEach(san => {
                    select.append(`<option value="${san.maSan}">${san.tenSan} - ${san.loaiSan} - ${san.gia}đ</option>`);
                });
            }
        },
        error: function (xhr, status, error) {
            console.log('Lỗi khi tải danh sách sân trống:');
            console.log('Status:', status);
            console.log('Error:', error);
            console.log('Response:', xhr.responseText);
        }
    });
}

// Tự gọi khi người dùng chọn ngày hoặc giờ
$('#myID, #time-value').on('change', fetchSanTrong);




