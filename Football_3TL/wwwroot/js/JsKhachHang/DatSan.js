
//document.addEventListener("DOMContentLoaded", function () {
//    function validateInput(inputId, errorId, regex, errorMessage) {
//        let input = document.getElementById(inputId);
//        let errorSpan = document.getElementById(errorId);

//        if (!input || !errorSpan) {
//            console.error(`Không tìm thấy phần tử với ID: ${inputId} hoặc ${errorId}`);
//            return () => false;
//        }

//        function checkValidation() {
//            if (regex.test(input.value.trim())) {
//                errorSpan.textContent = ""; // Ẩn lỗi nếu đúng
//                return true;
//            } else {
//                errorSpan.textContent = errorMessage; // Hiển thị lỗi nếu sai
//                return false;
//            }
//        }

//        input.addEventListener("input", checkValidation);
//        return checkValidation;
//    }

//    let checkHoten = validateInput("hoten", "error-hoten", /^[a-zA-ZÀ-ỹ\s]+$/, "Họ và tên không được chứa số hoặc ký tự đặc biệt!");
//    let checkSdt = validateInput("sdt", "error-sdt", /^0\d{9}$/, "Số điện thoại phải có 10 số và bắt đầu bằng 0.");

//    let ngayNhanInput = document.getElementById("myID");
//    let errorNgayNhan = document.getElementById("error-ngaynhan");

//    if (!ngayNhanInput || !errorNgayNhan) {
//        console.error("Không tìm thấy phần tử myID hoặc error-ngaynhan.");
//        return;
//    }

//    function checkNgayNhan() {
//        if (ngayNhanInput.value) {
//            errorNgayNhan.textContent = ""; // Ẩn lỗi nếu đã chọn ngày
//            return true;
//        } else {
//            errorNgayNhan.textContent = "Vui lòng chọn ngày nhận!";
//            return false;
//        }
//    }

//    ngayNhanInput.addEventListener("input", checkNgayNhan);

//    let btnDatSan = document.getElementById("btnDatSan");
//    if (!btnDatSan) {
//        console.error("Không tìm thấy nút btnDatSan.");
//        return;
//    }

//    btnDatSan.addEventListener("click", function () {
//        let isValid = checkHoten() & checkSdt() & checkNgayNhan();

//        if (isValid) {
//            showSweetAlert();

//            document.getElementById("hoten").value = "";
//            document.getElementById("sdt").value = "";
//            ngayNhanInput.value = "";

//            document.getElementById("error-hoten").textContent = "";
//            document.getElementById("error-sdt").textContent = "";
//            document.getElementById("error-ngaynhan").textContent = "";
//        }
//    });
//});


//document.addEventListener("DOMContentLoaded", function () {
//    function validateInput(inputId, errorId, regex, errorMessage) {
//        let input = document.getElementById(inputId);
//        let errorSpan = document.getElementById(errorId);

//        if (!input || !errorSpan) {
//            console.error(`Không tìm thấy phần tử với ID: ${inputId} hoặc ${errorId}`);
//            return () => false;
//        }

//        function checkValidation() {
//            if (regex.test(input.value.trim())) {
//                errorSpan.textContent = ""; // Ẩn lỗi nếu đúng
//                return true;
//            } else {
//                errorSpan.textContent = errorMessage; // Hiển thị lỗi nếu sai
//                return false;
//            }
//        }

//        input.addEventListener("input", checkValidation);
//        return checkValidation;
//    }

//    let checkHoten = validateInput("hoten", "error-hoten", /^[a-zA-ZÀ-ỹ\s]+$/, "Họ và tên không được chứa số hoặc ký tự đặc biệt!");
//    let checkSdt = validateInput("sdt", "error-sdt", /^0\d{9}$/, "Số điện thoại phải có 10 số và bắt đầu bằng 0.");

//    let ngayNhanInput = document.getElementById("myID");
//    let errorNgayNhan = document.getElementById("error-ngaynhan");

//    function checkNgayNhan() {
//        if (ngayNhanInput.value) {
//            errorNgayNhan.textContent = "";
//            return true;
//        } else {
//            errorNgayNhan.textContent = "Vui lòng chọn ngày nhận!";
//            return false;
//        }
//    }

//    ngayNhanInput.addEventListener("input", checkNgayNhan);

//    let btnDatSan = document.getElementById("btnDatSan");
//    let form = btnDatSan.closest("form"); // Lấy form chứa nút

//    btnDatSan.addEventListener("click", function (e) {
//        e.preventDefault(); // Ngăn submit mặc định

//        let isValid = checkHoten() & checkSdt() & checkNgayNhan();

//        if (isValid) {
//            // ✅ Gửi form nếu hợp lệ
//            form.submit();
//        } else {
//            // ❌ Không gửi form, hiển thị lỗi (đã xử lý ở trên)
//            console.log("Form không hợp lệ");
//        }
//    });
//});

// Hàm lấy tham số từ URL
//function getParameterByName(name) {
//    const url = window.location.href;
//    name = name.replace(/[\[\]]/g, '\\$&');
//    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
//        results = regex.exec(url);
//    if (!results) return null;
//    if (!results[2]) return '';
//    return decodeURIComponent(results[2].replace(/\+/g, ' '));
//}

//// Lấy giá trị maChuSan
//const maChuSan = getParameterByName('maChuSan');

//// Gán giá trị vào input
//if (maChuSan) {
//    document.getElementById('MaChuSan').value = maChuSan;
//}

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

    function checkNgayNhan() {
        if (ngayNhanInput.value) {
            errorNgayNhan.textContent = "";
            return true;
        } else {
            errorNgayNhan.textContent = "Vui lòng chọn ngày nhận!";
            return false;
        }
    }

    ngayNhanInput.addEventListener("input", checkNgayNhan);

    // ✅ Kiểm tra select sân
    let selectSan = document.getElementById("selectSan");
    let errorSan = document.createElement("span");
    errorSan.id = "error-san";
    errorSan.style.color = "red";
    selectSan.insertAdjacentElement("afterend", errorSan);

    function checkSelectSan() {
        if (selectSan.value !== "") {
            errorSan.textContent = "";
            return true;
        } else {
            errorSan.textContent = "Vui lòng chọn sân!";
            return false;
        }
    }

    selectSan.addEventListener("change", checkSelectSan);

    let btnDatSan = document.getElementById("btnDatSan");
    let form = btnDatSan.closest("form");

    btnDatSan.addEventListener("click", function (e) {
        e.preventDefault();

        let isValid = checkHoten() & checkSdt() & checkNgayNhan() & checkSelectSan();

        if (isValid) {
            form.submit();
        } else {
            console.log("Form không hợp lệ");
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
    const searchInput = document.getElementById("timKiemOnHeader"); // Ô input
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

// giờ chẳn
//$(document).ready(function () {
//    var maChuSan = $('#MaChuSan').val();

//    $.ajax({
//        url: '/Customer/DatSan/GetGioMoCua?maChuSan=' + maChuSan,
//        type: 'GET',
//        success: function (data) {
//            var gioMo = data.gioMoCua;
//            var gioDong = data.gioDongCua;

//            var html = '';

//            var now = new Date();
//            var currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

//            for (var i = gioMo * 2; i < gioDong * 2; i++) {
//                var startHour = Math.floor(i / 2);
//                var startMin = (i % 2 === 0) ? 0 : 30;

//                var endTotal = i + 2;
//                var endHour = Math.floor(endTotal / 2);
//                var endMin = (endTotal % 2 === 0) ? 0 : 30;

//                var startTimeStr = startHour.toString().padStart(2, '0') + ":" + (startMin === 0 ? "00" : "30");
//                var endTimeStr = (endHour % 24).toString().padStart(2, '0') + ":" + (endMin === 0 ? "00" : "30");

//                var slotStartMinutes = startHour * 60 + startMin;

//                var isPast = slotStartMinutes <= currentTimeMinutes;

//                html += `
//        <div class="col-6 col-md-4 col-lg-3 p-1 hower-giodat">
//          <div id="time-slot-container">
//            <div class="giodat p-2 d-flex flex-column align-items-center ${isPast ? 'disabled-slot' : ''}" ${isPast ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
//                <div class="fw-bold">${startTimeStr} - ${endTimeStr}</div>
//            </div>
//           </div>
//        </div>
//    `;
//            }

//            $('#khungGioContainer').html(html);

//            $('#khungGioContainer').on('click', '.giodat', function () {
//                const timeText = $(this).find('.fw-bold').text();
//                console.log("Giờ được chọn:", timeText);

//                // Hiện lên phần hiển thị
//                $('#time-value').text(timeText);

//                // Xóa lớp chọn cũ, thêm lớp mới
//                $('.giodat').removeClass('selected-slot');
//                $(this).addClass('selected-slot');
//            });
//        },
//        error: function () {
//            alert("Lỗi khi tải giờ mở cửa.");
//        }
//    });
//});


//$(document).ready(function () {
//    function loadTimeSlots() {
//        var maChuSan = $('#MaChuSan').val();

//        var dateParts = $('#myID').val().split("-");
//        var selectedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

//        var today = new Date();
//        selectedDate.setHours(0, 0, 0, 0);
//        today.setHours(0, 0, 0, 0);

//        $.ajax({
//            url: '/Customer/DatSan/GetGioMoCua?maChuSan=' + maChuSan,
//            type: 'GET',
//            success: function (data) {
//                var gioMo = data.gioMoCua;
//                var gioDong = data.gioDongCua;

//                var html = '';

//                var now = new Date();
//                var currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

//                for (var i = gioMo * 2; i < gioDong * 2; i++) {
//                    var startHour = Math.floor(i / 2);
//                    var startMin = (i % 2 === 0) ? 0 : 30;

//                    var endTotal = i + 2;
//                    var endHour = Math.floor(endTotal / 2);
//                    var endMin = (endTotal % 2 === 0) ? 0 : 30;

//                    var startTimeStr = startHour.toString().padStart(2, '0') + ":" + (startMin === 0 ? "00" : "30");
//                    var endTimeStr = (endHour % 24).toString().padStart(2, '0') + ":" + (endMin === 0 ? "00" : "30");

//                    var slotStartMinutes = startHour * 60 + startMin;

//                    var isPast = selectedDate.getTime() === today.getTime() && slotStartMinutes <= currentTimeMinutes;

//                    html += `
//                <div class="col-6 col-md-4 col-lg-3 p-1 hower-giodat">
//                  <div id="time-slot-container">
//                    <div class="giodat p-2 d-flex flex-column align-items-center ${isPast ? 'disabled-slot' : ''}" ${isPast ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
//                        <div class="fw-bold">${startTimeStr} - ${endTimeStr}</div>
//                    </div>
//                   </div>
//                </div>`;
//                }

//                $('#khungGioContainer').html(html);
//            },
//            error: function () {
//                alert("Lỗi khi tải giờ mở cửa.");
//            }
//        });
//    }


//    // Load khi trang load
//    loadTimeSlots();

//    // Load lại khi người dùng chọn ngày
//    $('#myID').on('change', function () {
//        loadTimeSlots();
//    });

//    // Bắt sự kiện chọn khung giờ
//    $('#khungGioContainer').on('click', '.giodat', function () {
//        const timeText = $(this).find('.fw-bold').text();
//        console.log("Giờ được chọn:", timeText);

//        $('#time-value').text(timeText);
//        $('.giodat').removeClass('selected-slot');
//        $(this).addClass('selected-slot');
//    });
//});

$(document).ready(function () {
    function loadTimeSlots() {
        var maChuSan = $('#MaChuSan').val();
        var selectedDateStr = $('#myID').val();
        if (!selectedDateStr) {
            console.error("Chưa có ngày được chọn!");
            return;
        }

        var dateParts = selectedDateStr.split("-");
        var selectedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // yyyy, mm (0-indexed), dd

        var today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        var isToday = selectedDate.getTime() === today.getTime(); // kiểm tra ngay từ đầu
        var currentTimeMinutes = new Date().getHours() * 60 + new Date().getMinutes(); // phút hiện tại (chỉ cần nếu là hôm nay)

        $.ajax({
            url: '/Customer/DatSan/GetGioMoCua?maChuSan=' + maChuSan,
            type: 'GET',
            success: function (data) {
                var gioMo = data.gioMoCua;
                var gioDong = data.gioDongCua;

                var html = '';

                for (var i = gioMo * 2; i < gioDong * 2; i++) {
                    var startHour = Math.floor(i / 2);
                    var startMin = (i % 2 === 0) ? 0 : 30;

                    var endTotal = i + 2;
                    var endHour = Math.floor(endTotal / 2);
                    var endMin = (endTotal % 2 === 0) ? 0 : 30;

                    var startTimeStr = startHour.toString().padStart(2, '0') + ":" + (startMin === 0 ? "00" : "30");
                    var endTimeStr = (endHour % 24).toString().padStart(2, '0') + ":" + (endMin === 0 ? "00" : "30");

                    var slotStartMinutes = startHour * 60 + startMin;
                    var isPast = false;

                    if (isToday) {
                        isPast = slotStartMinutes <= currentTimeMinutes;
                    }

                    html += `
                        <div class="col-6 col-md-4 col-lg-3 p-1 hower-giodat">
                            <div id="time-slot-container">
                                <div class="giodat p-2 d-flex flex-column align-items-center ${isPast ? 'disabled-slot' : ''}" ${isPast ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                                    <div class="fw-bold">${startTimeStr} - ${endTimeStr}</div>
                                </div>
                            </div>
                        </div>`;
                }

                $('#khungGioContainer').html(html);
            },
            error: function () {
                alert("Lỗi khi tải giờ mở cửa.");
            }
        });
    }

    // 👉 Load lần đầu tiên:
    loadTimeSlots();

    // 👉 Nếu chọn ngày khác:
    $('#myID').on('change', function () {
        loadTimeSlots();
    });

    // 👉 Chọn khung giờ:
    $('#khungGioContainer').on('click', '.giodat', function () {
        if ($(this).hasClass('disabled-slot')) {
            return;
        }

        const timeText = $(this).find('.fw-bold').text();
        console.log("Giờ được chọn:", timeText);

        $('#time-value').text(timeText);
        $('.giodat').removeClass('selected-slot');
        $(this).addClass('selected-slot');
    });
});



// giờ lẻ
//$(document).ready(function () {
//    var maChuSan = $('#MaChuSan').val();

//    $.ajax({
//        url: '/Customer/DatSan/GetGioMoCua?maChuSan=' + maChuSan,
//        type: 'GET',
//        success: function (data) {
//            var gioMo = data.gioMoCua;  // ví dụ: 6
//            var gioDong = data.gioDongCua; // ví dụ: 22

//            var html = '';

//            var now = new Date();
//            var currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

//            // duyệt từng khung 30 phút, nhưng hiển thị mỗi lần 1.5 giờ = 90 phút
//            for (var i = gioMo * 60; i <= (gioDong * 60 - 90); i += 30) {
//                var startHour = Math.floor(i / 60);
//                var startMin = i % 60;

//                var endMinutes = i + 90;
//                var endHour = Math.floor(endMinutes / 60);
//                var endMin = endMinutes % 60;

//                var startTimeStr = startHour.toString().padStart(2, '0') + ":" + startMin.toString().padStart(2, '0');
//                var endTimeStr = endHour.toString().padStart(2, '0') + ":" + endMin.toString().padStart(2, '0');

//                var isPast = i <= currentTimeMinutes;

//                html += `
//        <div class="col-6 col-md-4 col-lg-3 p-1 hower-giodat">
//            <div id="time-slot-container">
//              <div class="giodat p-2 d-flex flex-column align-items-center ${isPast ? 'disabled-slot' : ''}" ${isPast ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
//                <div class="fw-bold">${startTimeStr} - ${endTimeStr}</div>
//              </div>
//            </div>
//        </div>
//    `;
//            }

//            $('#KhungGioDatle').html(html); // ⚠️ container mới bạn yêu cầu

//            $('#KhungGioDatle').on('click', '.giodat', function () {
//                const timeText = $(this).find('.fw-bold').text();
//                console.log("Giờ được chọn:", timeText);

//                // Hiện lên phần hiển thị
//                $('#time-value').text(timeText);

//                // Xóa lớp chọn cũ, thêm lớp mới
//                $('.giodat').removeClass('selected-slot');
//                $(this).addClass('selected-slot');
//            });
//        },
//        error: function () {
//            alert("Lỗi khi tải giờ mở cửa.");
//        }
//    });
//});

$(document).ready(function () {
    function formatDateToInput(date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();
        return dd + '-' + mm + '-' + yyyy;
    }

    function loadTimeSlots() {
        var maChuSan = $('#MaChuSan').val();
        var inputDateStr = $('#myID').val();

        var parts = inputDateStr.split('-');
        var selectedDate = new Date(parts[2], parts[1] - 1, parts[0]);
        var today = new Date();

        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        $.ajax({
            url: '/Customer/DatSan/GetGioMoCua?maChuSan=' + maChuSan,
            type: 'GET',
            success: function (data) {
                var gioMo = data.gioMoCua;
                var gioDong = data.gioDongCua;

                var html = '';
                var now = new Date();
                var currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

                for (var i = gioMo * 60; i <= (gioDong * 60 - 90); i += 30) {
                    var startHour = Math.floor(i / 60);
                    var startMin = i % 60;

                    var endMinutes = i + 90;
                    var endHour = Math.floor(endMinutes / 60);
                    var endMin = endMinutes % 60;

                    var startTimeStr = startHour.toString().padStart(2, '0') + ":" + startMin.toString().padStart(2, '0');
                    var endTimeStr = endHour.toString().padStart(2, '0') + ":" + endMin.toString().padStart(2, '0');

                    var isPast = selectedDate.getTime() === today.getTime() && i <= currentTimeMinutes;

                    html += `
                        <div class="col-6 col-md-4 col-lg-3 p-1 hower-giodat">
                            <div id="time-slot-container">
                                <div class="giodat p-2 d-flex flex-column align-items-center ${isPast ? 'disabled-slot' : ''}" ${isPast ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                                    <div class="fw-bold">${startTimeStr} - ${endTimeStr}</div>
                                </div>
                            </div>
                        </div>`;
                }

                $('#KhungGioDatle').html(html);
            },
            error: function () {
                alert("Lỗi khi tải giờ mở cửa.");
            }
        });
    }

    // Gán ngày mặc định là hôm nay
    const today = new Date();
    $('#myID').val(formatDateToInput(today));

    // Tải khung giờ lần đầu
    loadTimeSlots();

    // Tải lại khi người dùng chọn ngày khác
    $('#myID').on('change', function () {
        loadTimeSlots();
    });

    // Bắt sự kiện chọn khung giờ
    $('#KhungGioDatle').on('click', '.giodat', function () {
        const timeText = $(this).find('.fw-bold').text();
        console.log("Giờ được chọn:", timeText);
        $('#time-value').text(timeText);
        $('.giodat').removeClass('selected-slot');
        $(this).addClass('selected-slot');
    });
});



//function fetchSanTrong() {

//    const raw = $('#myID').val(); // ví dụ: "24-04-2025"
//    const parts = raw.split("-");
//    const ngayDat = `${parts[2]}-${parts[1]}-${parts[0]}`; // "2025-04-24"
//    console.log("ngayDat:", ngayDat);

//    // Giả sử time-value là "18:00 - 19:00" hoặc "18:00"
//    const timeRange = $('#time-value').val() || $('#time-value').text();
//    let gioBatDau = timeRange.split('-')[0].trim(); // "18:00"

//    // ➕ thêm giây để chuẩn SQL datetime
//    if (gioBatDau.length === 5) {
//        gioBatDau += ":00"; // chuyển thành "18:00:00"
//    }
//    console.log("gioBatDau:", gioBatDau);

//    const maChuSan = $('#MaChuSan').val();

//    if (!ngayDat || !gioBatDau) return;

//    $.ajax({
//        url: '/Customer/DatSan/GetSanTrong',
//        type: 'GET',
//        data: {
//            ngayDat: ngayDat,
//            gioBatDau: gioBatDau,
//            maChuSan: maChuSan
//        },
//        success: function (result) {
//            console.log(result)
//            var select = $('#selectSan');
//            select.empty();

//            if (result.length === 0) {
//                select.append('<option value="">Không có sân trống</option>');
//            } else {
//                result.forEach(san => {
//                    select.append(`<option value="${san.maSan}" data-gia="${san.gia}"> Sân: ${san.tenSan} - ${san.gia}đ</option>`);
//                });
//            }
//        },
//        error: function (xhr, status, error) {
//            console.log('Lỗi khi tải danh sách sân trống:');
//            console.log('Status:', status);
//            console.log('Error:', error);
//            console.log('Response:', xhr.responseText);
//        }
//    });
//}

//// Tự gọi khi người dùng chọn ngày hoặc giờ
//$('#myID, #time-value').on('change', fetchSanTrong);


// Hàm fetch danh sách sân trống
//function fetchSanTrong() {
//    const raw = $('#myID').val(); // ví dụ: "26-04-2025"
//    const parts = raw.split("-");
//    const ngayDat = `${parts[2]}-${parts[1]}-${parts[0]}`; // "2025-04-26"
//    console.log("Ngày đặt:", ngayDat);

//    // Lấy giờ bắt đầu từ #time-value
//    const timeRange = $('#time-value').val() || $('#time-value').text();
//    let gioBatDau = timeRange.split('-')[0].trim(); // "12:00"

//    if (gioBatDau.length === 5) {
//        gioBatDau += ":00"; // "12:00:00"
//    }
//    console.log("Giờ bắt đầu:", gioBatDau);

//    const maChuSan = $('#MaChuSan').val(); // lấy mã chủ sân

//    if (!ngayDat || !gioBatDau || !maChuSan) {
//        console.log("Thiếu thông tin, không fetch.");
//        return;
//    }

//    // Gửi Ajax để lấy sân trống
//    $.ajax({
//        url: '/Customer/DatSan/GetSanTrong',
//        type: 'GET',
//        data: {
//            ngayDat: ngayDat,
//            gioBatDau: gioBatDau,
//            maChuSan: maChuSan
//        },
//        success: function (result) {
//            console.log("Kết quả sân trống:", result);

//            var select = $('#selectSan');
//            select.empty();

//            if (result.length === 0) {
//                select.append('<option value="">Không có sân trống</option>');
//            } else {
//                result.forEach(function (san) {
//                    select.append(`<option value="${san.maSan}" data-gia="${san.gia}">
//                        Sân: ${san.tenSan} - ${san.gia}đ
//                    </option>`);
//                });
//            }
//        },
//        error: function (xhr, status, error) {
//            console.error('Lỗi khi tải sân trống:', error);
//            console.error('Chi tiết:', xhr.responseText);
//        }
//    });
//}

function fetchSanTrong() {
    const raw = $('#myID').val(); // "26-04-2025"
    const parts = raw.split("-");
    const ngayDat = `${parts[2]}-${parts[1]}-${parts[0]}`; // "2025-04-26"

    const timeRange = $('#time-value').val() || $('#time-value').text();
    let gioBatDau = timeRange.split('-')[0].trim(); // "12:00"

    if (gioBatDau.length === 5) {
        gioBatDau += ":00";
    }

    const maChuSan = $('#MaChuSan').val();
    const thoiLuong = $('#thoiluong').val(); // 🔥 Lấy từ input hidden

    if (!ngayDat || !gioBatDau || !maChuSan || !thoiLuong) {
        console.log("Thiếu thông tin, không fetch.");
        return;
    }

    $.ajax({
        url: '/Customer/DatSan/GetSanTrong',
        type: 'GET',
        data: {
            ngayDat: ngayDat,
            gioBatDau: gioBatDau,
            maChuSan: maChuSan,
            thoiLuong: thoiLuong // 🔥 Gửi thêm
        },
        success: function (result) {
            console.log("Kết quả sân trống:", result);

            var select = $('#selectSan');
            select.empty();

            if (result.length === 0) {
                select.append('<option value="">Không có sân trống</option>');
            } else {
                select.append('<option value="">Chưa chọn sân</option>');
                result.forEach(function (san) {
                    select.append(`<option value="${san.maSan}" data-gia="${san.gia}">
                        Sân: ${san.tenSan} - ${san.gia}đ
                    </option>`);
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi tải sân trống:', error);
            console.error('Chi tiết:', xhr.responseText);
        }
    });
}


// Setup sự kiện chọn ngày và giờ
function setupDatSan() {
    // Khi người dùng đổi ngày
    $('#myID').on('change', function () {
        fetchSanTrong();
        $('#TongThanhToan').text('');
    });

    // Khi người dùng click chọn giờ (giả sử .giodat là khung giờ)
    $('#khungGioContainer').on('click', '.giodat', function () {
        if ($(this).hasClass('disabled-slot')) {
            return; // nếu đã disable thì không làm gì
        }

        // Lấy giờ text trong khung giờ
        const timeText = $(this).find('.fw-bold').text();
        console.log("Giờ được chọn:", timeText);

        // Cập nhật lại #time-value
        $('#time-value').text(timeText);

        // Đổi class selected
        $('.giodat').removeClass('selected-slot');
        $(this).addClass('selected-slot');

        // Fetch sân trống ngay sau khi chọn giờ
        fetchSanTrong();
    });
    $('#KhungGioDatle').on('click', '.giodat', function () {
        if ($(this).hasClass('disabled-slot')) {
            return; // nếu đã disable thì không làm gì
        }

        // Lấy giờ text trong khung giờ
        const timeText = $(this).find('.fw-bold').text();
        console.log("Giờ được chọn:", timeText);

        // Cập nhật lại #time-value
        $('#time-value').text(timeText);

        // Đổi class selected
        $('.giodat').removeClass('selected-slot');
        $(this).addClass('selected-slot');

        // Fetch sân trống ngay sau khi chọn giờ
        fetchSanTrong();
    });
}

// Gọi setup khi trang vừa load
$(document).ready(function () {
    setupDatSan();
});




//$(document).ready(function () {
//    $('#selectSan').on('change', function () {
//        const selected = $(this).find('option:selected');

//        const maSan = selected.val();
//        const tenSan = selected.text().split('-')[0].replace('Sân:', '').trim();

//        $('#hiddenMaSan').val(maSan);
//        $('#hiddenTenSan').val(tenSan);

//        console.log("Đã cập nhật:");
//        console.log("maSan:", maSan);
//        console.log("tenSan:", tenSan);
//    });
//});

function autoSelectFirstOption() {
    let $selectSan = $('#selectSan');
    let $hiddenMaSan = $('#hiddenMaSan');
    let $hiddenTenSan = $('#hiddenTenSan');

    if ($selectSan.find('option').length > 1) {
        $selectSan.prop('selectedIndex', 1); // chọn option thứ 2

        let selected = $selectSan.find('option:selected');
        let maSan = selected.val();
        let tenSan = selected.text().split('-')[0].replace('Sân:', '').replace('Sân:', '').trim();

        $hiddenMaSan.val(maSan);
        $hiddenTenSan.val(tenSan);
    } else {
        $hiddenMaSan.val('');
        $hiddenTenSan.val('');
    }
}

autoSelectFirstOption();



$(document).ready(function () {
    $('#timeSelect').on('change', function () {
        const value = $(this).val();
        let thoiluong = 60; // default

        if (value == "1.5") {
            thoiluong = 90;
        }

        $('#thoiluong').val(thoiluong);
    });

    // Gọi 1 lần ban đầu nếu đã có sẵn giá trị
    $('#timeSelect').trigger('change');
});


document.addEventListener("DOMContentLoaded", function () {
    var tongThanhToan = document.getElementById("TongThanhToan");
    var amountInput = document.getElementById("Amount");

    var timeValue = document.getElementById("time-value");
    var hiddenGioDat = document.getElementById("hiddenGioDat");

    var selectSan = document.getElementById("selectSan");
    var hiddenTenSan = document.getElementById("hiddenTenSan");
    var hiddenMaSan = document.getElementById("hiddenMaSan");

    var timeSelect = document.getElementById("timeSelect");
    var thoiluong = document.getElementById("thoiluong");

    var myID = document.getElementById("myID");
    var hiddenNgayDat = document.getElementById("hiddenNgayDat");

    // Hàm update Amount
    function updateAmount() {
        var tongThanhToanText = tongThanhToan.innerText;
        var amount = tongThanhToanText.replace(/\./g, '').replace('đ', '').trim();
        amountInput.value = amount;
        console.log("gias", amountInput.value)
    }

    // Hàm update Giờ Đặt (chỉ lấy giờ bắt đầu, format HH:mm:ss)
    function updateGioDat() {
        var gioDatText = timeValue.innerText.trim();
        var startTime = gioDatText.split('-')[0].trim(); // Lấy phần trước dấu '-'
        if (startTime.length === 5) {
            startTime += ":00"; // Thêm giây nếu cần
        }
        hiddenGioDat.value = startTime;
    }

    // Hàm update Sân
    function updateSan() {
        var selectedOption = selectSan.options[selectSan.selectedIndex];

        if (selectedOption.value !== "") {
            var text = selectedOption.text.trim(); // "Sân: Sân 4 - 200000đ"

            // Lấy tên sân từ chuỗi hiển thị, loại bỏ "Sân: " và phần sau dấu "-"
            var tenSan = text.split('-')[0].replace("Sân:", "").trim(); // Kết quả: "Sân 4"

            hiddenTenSan.value = tenSan;
            hiddenMaSan.value = selectedOption.value;
        } else {
            hiddenTenSan.value = "";
            hiddenMaSan.value = "";
        }
    }


    // Hàm update Thời lượng
    function updateThoiLuong() {
        var selectedHours = parseFloat(timeSelect.value);
        var minutes = selectedHours * 60;
        thoiluong.value = minutes;
    }

    // Hàm update Ngày Đặt (format yyyy-MM-dd)
    function updateNgayDat() {
        var ngayNhan = myID.value;
        if (ngayNhan.includes("-")) {
            // Nếu format dd-MM-yyyy thì đảo lại
            var parts = ngayNhan.split("-");
            if (parts.length === 3) {
                hiddenNgayDat.value = parts[2] + "-" + parts[1] + "-" + parts[0];
            }
        } else {
            hiddenNgayDat.value = ngayNhan;
        }
    }

    // Cập nhật ban đầu
    updateGioDat();
    updateSan();
    updateThoiLuong();
    updateNgayDat();

    // Tự động lắng nghe thay đổi
    //var observer = new MutationObserver(updateAmount);
    //observer.observe(tongThanhToan, { childList: true, characterData: true, subtree: true });

    $('#selectSan').on('change', function () {
        const maSan = $(this).val();
        if (maSan != 0) {
            const selectedOption = $(this).find('option:selected');
            const gia = selectedOption.data('gia') || 0;
            const soGio = $('#timeSelect').val(); // giả sử bạn có dropdown chọn "1 giờ", "1.5 giờ"...

            let heSo = 1;
            if (soGio.includes("1.5")) heSo = 1.5;
            else if (soGio.includes("2")) heSo = 2;

            const tong = gia * heSo;
            $('#TongThanhToan').text(tong.toLocaleString('vi-VN') + 'đ');
            ThayDoiGia(tong);
        }
    });

    function ThayDoiGia(tongThanhToan) {
        var maChuSan = $('#MaChuSan').val();
        var ngayNhan = formatNgayNhan($('#hiddenNgayDat').val()); // Định dạng: yyyy-MM-dd
        $.ajax({
            url: "/ChuSanBong/KhuyenMai/ChangePrice",
            type: "GET",
            data: {
                maChuSan: maChuSan,
                ngayNhan: ngayNhan
            },
            success: function (response) {
                if (response.success && response.data) {
                    var giamGia = response.data;
                    var giaSauGiam = tongThanhToan - (tongThanhToan * giamGia / 100);
                    $('#Amount').val(tongThanhToan);
                    console.log($('#Amount').val());
                    // Hiển thị giá gạch và giá mới
                    $('#TongThanhToan').html(`
    <span style="font-size: 0.6rem; text-decoration: line-through; color: #dc3545; margin-right: 6px;">
        ${tongThanhToan.toLocaleString()} VND
    </span>
    <span style="font-size: 1.2rem; color: #28a745; font-weight: 700;">
        ${giaSauGiam.toLocaleString()} VND
    </span>
`);
                }
                else {
                    updateAmount();
                }
            },
            error: function (xhr, status, error) {
                $('#promoInfo').hide();
                toastr.error("Có lỗi khi lấy thông tin khuyến mãi.");
                console.error(xhr, status, error);
            }
        });
    }
    function formatNgayNhan(dateString) {
        var date = new Date(dateString);
        if (isNaN(date.getTime())) return null;

        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    var observerGioDat = new MutationObserver(updateGioDat);
    observerGioDat.observe(timeValue, { childList: true, characterData: true, subtree: true });

    selectSan.addEventListener('change', updateSan);
    timeSelect.addEventListener('change', updateThoiLuong);
    myID.addEventListener('change', updateNgayDat);
});



