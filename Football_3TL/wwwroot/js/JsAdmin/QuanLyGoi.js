function checkDataThemGoi() {
    // 1. Reset thông báo lỗi và class 'input-error' cho tất cả các trường trước khi kiểm tra
    resetErrorDataThemGoi();
    var thoiHan = $('#thoiHanGoi').val().trim();
    var giaGoi = $('#giaGoiDangKy').val().trim();

    var isValid = true; // Sửa từ isValue thành isValid

    // Kiểm tra trường Thời Hạn
    if (thoiHan === '') {
        $('#thoiHanGoiError').text("Bạn chưa nhập thời hạn!");
        $('#thoiHanGoi').addClass("input-error");
        isValid = false;
    }
    // Sử dụng parseFloat() và kiểm tra các điều kiện
    else if (isNaN(parseFloat(thoiHan)) || parseFloat(thoiHan) < 1 || parseFloat(thoiHan) > 50) {
        $('#thoiHanGoiError').text("Thời hạn không hợp lệ! (Phải là số từ 1 đến 50 tháng)"); // Gợi ý lỗi rõ ràng hơn
        $('#thoiHanGoi').addClass("input-error");
        isValid = false;
    }

    // Kiểm tra trường Giá Gói
    if (giaGoi === '') {
        $('#giaGoiDangKyError').text("Bạn chưa nhập giá gói!"); // Sửa lỗi ngữ pháp
        $('#giaGoiDangKy').addClass("input-error");
        isValid = false;
    }
    // Sử dụng parseFloat() và kiểm tra các điều kiện
    else if (isNaN(parseFloat(giaGoi)) || parseFloat(giaGoi) < 1) {
        $('#giaGoiDangKyError').text("Giá gói không hợp lệ! (Phải là số dương)"); // Gợi ý lỗi rõ ràng hơn
        $('#giaGoiDangKy').addClass("input-error");
        isValid = false;
    }

    return isValid; // **Quan trọng: Trả về trạng thái hợp lệ của dữ liệu**
}
//hàm reset thông báo lỗi
function resetErrorDataThemGoi() {
    $('#thoiHanGoiError').text("");
    $('#thoiHanGoi').removeClass("input-error");
    $('#giaGoiDangKyError').text("");
    $('#giaGoiDangKy').removeClass("input-error");
}

//hàm reset data them fun

function resetDataThemGoi() {
    $('#thoiHanGoi').val("");
    $('#giaGoiDangKy').val("");
    resetErrorDataThemGoi()
}

function resetErrorDataSuaGoi() {
    $('#thoiHanGoiSuaError').text("");
    $('#thoiHanGoiSua').removeClass("input-error");
    $('#giaGoiDangKySuaError').text("");
    $('#giaGoiDangKySua').removeClass("input-error");
}


function checkDataSuaGoi() {
    // 1. Reset thông báo lỗi và class 'input-error'
    const fields = [
        { id: '#thoiHanGoiSua', errorId: '#thoiHanGoiSuaError', name: 'Thời hạn', min: 0, max: 50, positiveOnly: false },
        { id: '#giaGoiDangKySua', errorId: '#giaGoiDangKySuaError', name: 'Giá gói', min: 0, max: Infinity, positiveOnly: true }
    ];
    let isValid = true;
    let firstErrorField = null;

    fields.forEach(f => {
        // Reset
        $(f.errorId).text('');
        $(f.id).removeClass('input-error');

        const raw = $(f.id).val()?.trim() ?? '';
        if (!raw) {
            $(f.errorId).text(`Bạn chưa nhập ${f.name.toLowerCase()}!`);
            $(f.id).addClass('input-error');
            isValid = false;
            firstErrorField = firstErrorField || f.id;
            return;
        }

        const num = parseFloat(raw);
        if (isNaN(num) || num < f.min || num > f.max) {
            // Tạo thông báo linh hoạt
            const rangeTxt = isFinite(f.max)
                ? `từ ${f.min} đến ${f.max}`
                : `lớn hơn hoặc bằng ${f.min}`;
            $(f.errorId).text(`${f.name} không hợp lệ! (Phải là số ${rangeTxt})`);
            $(f.id).addClass('input-error');
            isValid = false;
            firstErrorField = firstErrorField || f.id;
        }
    });

    // 2. Tự động focus vào trường đầu tiên có lỗi (nâng cao trải nghiệm)
    if (firstErrorField) {
        $(firstErrorField).focus();
    }

    return isValid;
}

//hàm reset thông báo lỗi
function resetErrorDataSuaGoi() {
    $('#thoiHanGoiSuaError').text("");
    $('#thoiHanGoiSua').removeClass("input-error");
    $('#giaGoiDangKySuaError').text("");
    $('#giaGoiDangKySua').removeClass("input-error");
}
