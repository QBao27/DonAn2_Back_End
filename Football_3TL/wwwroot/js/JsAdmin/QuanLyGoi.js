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

    if (isValid) {
        ThemGoiDangKy();
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

    if (isValid) {
        SuaGoiDangKy();
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

// Hàm hiển thị danh sách gói
function hienThiDanhSachGoi() {
    $.ajax({
        url: '/Admin/QuanLyGoi/GetAllGoi',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                const $tbody = $('#goiDangKyTable');
                $tbody.empty(); // Xóa nội dung cũ

                if (response.data && response.data.length > 0) {
                    response.data.forEach(function (goi, index) {
                        // format số với phân cách hàng nghìn
                        const giaFormatted = Number(goi.gia).toLocaleString('vi-VN');

                        const row = `
              <tr>
                <th scope="row">${index + 1}</th>
                <td>${goi.maGoi}</td>
                <td>${goi.thoiHan} tháng</td>
                <td>${giaFormatted} VND</td>
                <td class="d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn btn-warning me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#suaGoiDangKy"
                    onclick="resetErrorDataSuaGoi();openEditModal(${goi.maGoi})"
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    onclick="deleteGoi(${goi.maGoi})"
                  >
                    Xóa
                  </button>
                </td>
              </tr>`;

                        $tbody.append(row);
                    });
                } else {
                    const emptyRow = `
            <tr>
              <td colspan="5" class="text-center text-danger">
                Không có gói đăng ký
              </td>
            </tr>`;
                    $tbody.append(emptyRow);
                }
            } else {
                // trường hợp response.success == false
                Swal.fire({
                    icon: 'warning',
                    title: 'Chú ý',
                    text: response.message || 'Không thể tải dữ liệu gói',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi tải danh sách gói:", error);
            Swal.fire({
                icon: "error",
                title: "Lỗi kết nối",
                text: "Không thể kết nối với máy chủ!",
                confirmButtonText: "OK",
                timer: 2000
            });
        }
    });
}

//hàm hiển thị data lên modal 
function openEditModal(id) {
    // Gọi API lấy thông tin gói
    $.ajax({
        url: '/Admin/QuanLyGoi/GetGoiById',
        type: 'GET',
        data: { id: id },
        success: function (response) {
            if (response.success) {
                const goi = response.data;
                // Điền giá trị vào form trong modal (giả sử bạn có input với các id tương ứng)
                $('#thoiHanGoiSua').val(goi.thoiHan);
                $('#giaGoiDangKySua').val(goi.gia);
                $('#editMaGoi').val(id);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: response.message || 'Không thể tải dữ liệu gói',
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi lấy chi tiết gói:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối đến máy chủ',
            });
        }
    });
}


// Hàm thêm gói đăng ký
function ThemGoiDangKy() {
    const thoiHan = Number($('#thoiHanGoi').val());
    const gia = Number($('#giaGoiDangKy').val());
  
    // Chuẩn bị payload JSON
    const goi = {
        ThoiHan: thoiHan,
        Gia: gia
    };

    $.ajax({
        url: '/Admin/QuanLyGoi/AddGoi',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(goi),
        success: function (resp) {
            if (resp.success) {
                // Ẩn modal
                $('#themGoiDangKy').modal('hide');
                hienThiDanhSachGoi();
                // Notification
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: resp.message || 'Đã thêm gói mới!'
                });
            } else {
                $('#themGoiDangKy').modal('hide');
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: resp.message || 'Thêm gói thất bại'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi thêm gói:', error);
            $('#themGoiDangKy').modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối tới máy chủ'
            });
        }
    });
}

// Hàm sửa gói đăng ký
function SuaGoiDangKy() {
    const id = Number($('#editMaGoi').val());
    const thoiHan = Number($('#thoiHanGoiSua').val());
    const gia = Number($('#giaGoiDangKySua').val());

    // Build object theo model GoiDangKy
    const goi = {
        MaGoi: id,
        ThoiHan: thoiHan,
        Gia: gia
    };

    $.ajax({
        url: '/Admin/QuanLyGoi/UpdateGoi',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(goi),
        success: function (resp) {
            if (resp.success) {
                // Ẩn modal và refresh
                $('#suaGoiDangKy').modal('hide');
                hienThiDanhSachGoi();
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: resp.message
                });
            } else {
                $('#suaGoiDangKy').modal('hide');
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: resp.message
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi cập nhật gói:', error);
            $('#suaGoiDangKy').modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối tới máy chủ'
            });
        }
    });
}

// Hàm xóa gói đăng ký 
function deleteGoi(id) {
    Swal.fire({
        title: 'Bạn có chắc muốn xóa?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Vâng, xóa đi!',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/Admin/QuanLyGoi/DeleteGoi',
                type: 'POST',
                data: { id: id },  // gửi form-encoded để ASP.NET bind vào param `id`
                success: function (resp) {
                    if (resp.success) {
                        // Reload lại danh sách
                        hienThiDanhSachGoi();
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: resp.message
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: resp.message || 'Xóa thất bại'
                        });
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Lỗi khi xóa gói:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi kết nối',
                        text: 'Không thể kết nối tới máy chủ'
                    });
                }
            });
        }
    });
}


$(document).ready(function () {
    hienThiDanhSachGoi();
});
