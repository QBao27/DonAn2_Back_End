// Hàm tạo danh sách giờ dựa theo khoảng thời gian
function loadTimeOptions(interval) {
    let select = $("#selectGio");
    select.empty().append('<option selected>Chọn khung giờ</option>'); // Xóa options cũ

    if (interval === 1) {
        // Khi thời lượng là 1 giờ: 08:00 - 09:00, 09:00 - 10:00, ..., 23:00 - 24:00
        for (let i = 8; i < 23; i++) {
            let startHour = i.toString().padStart(2, '0');
            let endHour = (i + 1).toString().padStart(2, '0');
            select.append(`<option value="${startHour}:00">${startHour}:00 - ${endHour}:00</option>`);
        }
    } else if (interval === 1.5) {
        // Khi thời lượng là 1.5 giờ: tạo option theo chuỗi liên tiếp
        let startTime = 8 * 60; // Bắt đầu từ 8:00 (tính bằng phút từ nửa đêm)
        let endOfDay = 24 * 60; // Giới hạn cuối ngày là 24:00 (1440 phút)

        // Vòng lặp chạy cho đến khi khoảng thời gian kết thúc vượt qua 24:00
        while (startTime + 90 <= endOfDay) {
            let startHour = Math.floor(startTime / 60).toString().padStart(2, '0');
            let startMin = (startTime % 60).toString().padStart(2, '0');
            let optionStart = `${startHour}:${startMin}`;

            let endTime = startTime + 90;
            let endHour = Math.floor(endTime / 60) % 24;
            let endMin = (endTime % 60).toString().padStart(2, '0');
            let optionEnd = `${endHour.toString().padStart(2, '0')}:${endMin}`;

            select.append(`<option value="${optionStart}">${optionStart} - ${optionEnd}</option>`);

            startTime += 90; // Tăng startTime thêm 90 phút cho khoảng thời gian kế tiếp
        }
    }
}

// Hàm cập nhật trạng thái disable cho các option nếu ngày được chọn là hôm nay
function updateTimeOptionsForToday() {
    let selectedDateStr = $("#myIDQLDS").val();
    if (!selectedDateStr) return;

    // Parse ngày được chọn theo định dạng "d-m-Y"
    let parts = selectedDateStr.split("-");
    let selectedDate = new Date(parts[2], parts[1] - 1, parts[0]);
    let today = new Date();

    // So sánh ngày (bỏ qua thời gian)
    if (selectedDate.toDateString() === today.toDateString()) {
        let currentHour = today.getHours();
        let currentMinute = today.getMinutes();

        $("#selectGio option").each(function () {
            let timeVal = $(this).attr("value");
            // Bỏ qua option mặc định không có value
            if (!timeVal) return;
            let timeParts = timeVal.split(":");
            let optionHour = parseInt(timeParts[0], 10);
            let optionMinute = parseInt(timeParts[1], 10);

            // Nếu giờ của option nhỏ hơn giờ hiện tại hoặc bằng giờ hiện tại nhưng phút nhỏ hơn hoặc bằng thì disable
            if (optionHour < currentHour || (optionHour === currentHour && optionMinute <= currentMinute)) {
                $(this).prop("disabled", true);
            } else {
                $(this).prop("disabled", false);
            }
        });
    } else {
        // Nếu không phải ngày hôm nay thì cho phép tất cả option
        $("#selectGio option").prop("disabled", false);
    }
}

$(document).ready(function () {
    // Giả sử giá trị mặc định của thời lượng là 1 giờ
    let defaultInterval = 1;
    loadTimeOptions(defaultInterval);

    // Giả sử bạn có một <select id="selectThoiLuong"> để chọn khoảng thời gian (1 hoặc 1.5)
    $("#selectThoiLuong").change(function () {
        let interval = parseFloat($(this).val());
        loadTimeOptions(interval);
        updateTimeOptionsForToday();
    });

    //reset tìm kiếm 
    $('#btnResetSearchQLDS').click(function () {
        $('#searchQuanLyDatSan').val('');
        $('#myIDQLDS').val('');
        $('#selectThoiLuong').val('').prop('selectedIndex', 0);;
        $('#selectGio').val('').prop('selectedIndex', 0);;
    });
});
