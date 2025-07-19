// 1. Hàm reset tất cả lỗi và trạng thái input
function resetErrorDataThemKM() {
    // Xoá text lỗi
    $('#errortenChuongTrinhKhuyenMai').text('');
    $('#errorGiamGiaKhuyenMai').text('');
    $('#errorNgayBatDauChuongTrinh').text('');
    $('#errorNgayKetThucChuongTrinh').text('');

    // Xoá class đánh dấu lỗi (nếu bạn có CSS .input-error)
    $('#tenChuongTrinhKhuyenMai').removeClass('input-error');
    $('#giamGiaKhuyenMai').removeClass('input-error');
    $('#ngayBatDauChuongTrinh').removeClass('input-error');
    $('#ngayKetThucChuongTrinh').removeClass('input-error');
}

// 2. Hàm validate data trước khi gọi AJAX thêm khuyến mãi
function checkDataThemKM() {
    // Trước tiên reset lại mọi lỗi cũ
    resetErrorDataThemKM();

    // Lấy giá trị
    const tenKm = $('#tenChuongTrinhKhuyenMai').val().trim();
    const giaTriStr = $('#giamGiaKhuyenMai').val().trim();
    const ngayBDStr = $('#ngayBatDauChuongTrinh').val().trim();
    const ngayKTStr = $('#ngayKetThucChuongTrinh').val().trim();

    let valid = true;
    let ngayBD, ngayKT;

    // 1. Tên chương trình
    if (!tenKm) {
        $('#errortenChuongTrinhKhuyenMai')
            .text('Tên chương trình không được để trống');
        $('#tenChuongTrinhKhuyenMai').addClass('input-error');
        valid = false;
    }

    // 2. Giá trị khuyến mãi (%)
    const giaTri = Number(giaTriStr);
    if (!giaTriStr) {
        $('#errorGiamGiaKhuyenMai')
            .text('Giá trị khuyến mãi không được để trống');
        $('#giamGiaKhuyenMai').addClass('input-error');
        valid = false;
    } else if (isNaN(giaTri) || giaTri <= 0 || giaTri > 100) {
        $('#errorGiamGiaKhuyenMai')
            .text('Phải là số > 0 và ≤ 100');
        $('#giamGiaKhuyenMai').addClass('input-error');
        valid = false;
    }

    if (!ngayBDStr) {
        $('#errorNgayBatDauChuongTrinh')
            .text('Chưa chọn ngày bắt đầu')
            .addClass('input-error');
        valid = false;
    } else {
        ngayBD = new Date(ngayBDStr);
        // xóa lỗi cũ nếu parse thành công
        $('#errorNgayBatDauChuongTrinh').text('').removeClass('input-error');
    }

    // 5. Ngày kết thúc
    if (!ngayKTStr) {
        $('#errorNgayKetThucChuongTrinh')
            .text('Chưa chọn ngày kết thúc')
            .addClass('input-error');
        valid = false;
    } else {
        ngayKT = new Date(ngayKTStr);
        $('#errorNgayKetThucChuongTrinh').text('').removeClass('input-error');
    }

    // 6. So sánh ngày — chỉ khi cả hai đã có Date object
    if (ngayBD && ngayKT && ngayKT <=  ngayBD) {
        $('#errorNgayKetThucChuongTrinh')
            .text('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu')
            .addClass('input-error');
        valid = false;
    }

    // Nếu có lỗi thì dừng và trả về false
    if (valid) {
        ThemKhuyenMai();
    }

    // Nếu pass hết, trả về true để bạn gọi AJAX addKhuyenMai()
    return true;
}

//3. hàm reset data 
function resetDataThemKM() {
    // 1. Clear giá trị các input
    $('#tenChuongTrinhKhuyenMai').val('');
    $('#giamGiaKhuyenMai').val('');

    // 2. Clear Flatpickr: xóa giá trị và UI trên các input .ngayKhuyenMai
    $('.ngayKhuyenMai').each(function () {
        // xóa value trên thẻ input
        $(this).val('');
        // nếu đã có instance của flatpickr, gọi clear()
        if (this._flatpickr) {
            this._flatpickr.clear();
        }
    });

    // 3. Xóa tất cả lỗi và class error
    resetErrorDataThemKM();
}

// 1. Hàm reset tất cả lỗi và trạng thái input trên form Sửa KM
function resetErrorDataSuaKM() {
    // Xóa text lỗi
    $('#errortenChuongTrinhKhuyenMaiSua').text('');
    $('#ErrorgiamGia').text('');
    $('#errorNgayBatDauChuongTrinhSua').text('');
    $('#errorNgayKetThucChuongTrinhSua').text('');

    // Xóa class input-error
    $('#tenChuongTrinhKhuyenMaiSua').removeClass('input-error');
    $('#giamGiaSua').removeClass('input-error');
    $('#ngayBatDauChuongTrinhSua').removeClass('input-error');
    $('#ngayKetThucChuongTrinhSua').removeClass('input-error');
}

// 2. Hàm validate data trước khi gọi AJAX sửa khuyến mãi
function checkDataSuaKM() {
    // Reset lỗi cũ
    resetErrorDataSuaKM();

    // Lấy giá trị
    const tenKmStr = $('#tenChuongTrinhKhuyenMaiSua').val().trim();
    const giaTriStr = $('#giamGiaSua').val().trim();
    const ngayBDStr = $('#ngayBatDauChuongTrinhSua').val().trim();
    const ngayKTStr = $('#ngayKetThucChuongTrinhSua').val().trim();

    let valid = true;
    let ngayBD, ngayKT;

    // 1. Tên chương trình
    if (!tenKmStr) {
        $('#errortenChuongTrinhKhuyenMaiSua')
            .text('Tên chương trình không được để trống');
        $('#tenChuongTrinhKhuyenMaiSua').addClass('input-error');
        valid = false;
    }

    // 2. Giá trị khuyến mãi
    const giaTri = Number(giaTriStr);
    if (!giaTriStr) {
        $('#errorGiamGia')
            .text('Giá trị khuyến mãi không được để trống');
        $('#giamGiaSua').addClass('input-error');
        valid = false;
    } else if (isNaN(giaTri) || giaTri <= 0 || giaTri > 100) {
        $('#errorGiamGia')
            .text('Phải là số > 0 và ≤ 100');
        $('#giamGiaSua').addClass('input-error');
        valid = false;
    }

    // 3. Ngày bắt đầu
    if (!ngayBDStr) {
        $('#errorNgayBatDauChuongTrinhSua')
            .text('Chưa chọn ngày bắt đầu');
        $('#ngayBatDauChuongTrinhSua').addClass('input-error');
        valid = false;
    } else {
        ngayBD = new Date(ngayBDStr);
        $('#errorNgayBatDauChuongTrinhSua')
            .text('').removeClass('input-error');
    }

    // 4. Ngày kết thúc
    if (!ngayKTStr) {
        $('#errorNgayKetThucChuongTrinhSua')
            .text('Chưa chọn ngày kết thúc');
        $('#ngayKetThucChuongTrinhSua').addClass('input-error');
        valid = false;
    } else {
        ngayKT = new Date(ngayKTStr);
        $('#errorNgayKetThucChuongTrinhSua')
            .text('').removeClass('input-error');
    }

    // 5. So sánh ngày (chỉ khi cả hai đã có Date)
    if (ngayBD && ngayKT && ngayKT < ngayBD) {
        $('#errorNgayKetThucChuongTrinhSua')
            .text('Ngày kết thúc phải sau ngày bắt đầu');
        $('#ngayKetThucChuongTrinhSua').addClass('input-error');
        valid = false;
    }

    if (valid) {
        UpdateKM();
    }

    return valid;
}

// 3. Hàm reset dữ liệu và lỗi trên form Sửa KM
function resetDataSuaKM() {
    // Clear giá trị các input text
    $('#tenChuongTrinhKhuyenMaiSua').val('');
    $('#giamGiaSua').val('');

    // Clear Flatpickr trên các input .ngayKhuyenMai (nếu dùng)
    $('.ngayKhuyenMai').each(function () {
        $(this).val('');
        if (this._flatpickr) this._flatpickr.clear();
    });

    // Clear lỗi và class đỏ
    resetErrorDataSuaKM();
}

// Hàm hiển thị danh sách khuyến mãi
function hienThiDanhSachKM() {
    $.ajax({
        url: '/ChuSanBong/KhuyenMai/GetAllKhuyenMai',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                const $tbody = $('#tableChuongTrinhKhuyenMai');
                $tbody.empty(); // Xóa nội dung cũ

                if (response.data && response.data.length > 0) {
                    response.data.forEach(function (km, index) {
                        // format số với phân cách hàng nghìn
                        const giaFormatted = Number(km.gia).toLocaleString('vi-VN');

                        const row = `
               <tr>
                                        <th scope="row">${index + 1}</th>
                                        <td>${km.tenKm}</td>
                                        <td>${km.ngayBd}</td>
                                        <td>${km.ngayKt}</td>
                                        <td><span>${km.giamGia}</span> %</td>
                                        <td>${km.trangThai}</td>
                                        <td class="d-flex justify-content-end">
                                            <button type="button" class="btn btn-warning me-2" onclick="suaChuongTrinhKhuiyenMaiModal(); resetDataSuaKM(), openEditModalKM(${km.maKm})">
                                                Sửa
                                            </button>
                                            <button type="button" class="btn btn-danger" onclick="deleteKM(${km.maKm})">Xóa</button>
                                        </td>
                                    </tr>`;

                        $tbody.append(row);
                    });
                } else {
                    const emptyRow = `
            <tr>
              <td colspan="12" class="text-center text-danger">
                Không có chương trình khuyến mãi nào!
              </td>
            </tr>`;
                    $tbody.append(emptyRow);
                }
            } else {
                // trường hợp response.success == false
                Swal.fire({
                    icon: 'warning',
                    title: 'Chú ý',
                    text: response.message || 'Không thể tải dữ liệu',
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

// Hàm load data lên modal sửa
function openEditModalKM(id) {
    $.ajax({
        url: '/ChuSanBong/KhuyenMai/GetKhuyenMaiById',
        type: 'GET',
        data: { id: id },
        success: function (response) {
            if (response.success) {
                const km = response.data;

                // Gán giá trị input text
                $('#tenChuongTrinhKhuyenMaiSua').val(km.tenKm);
                $('#giamGiaSua').val(km.giamGia);
                $('#editMaKm').val(id);

                // Gán ngày bằng flatpickr (đã bật altInput)
                const fpNgayBd = document.querySelector("#ngayBatDauChuongTrinhSua")._flatpickr;
                const fpNgayKt = document.querySelector("#ngayKetThucChuongTrinhSua")._flatpickr;

                if (fpNgayBd) fpNgayBd.setDate(km.ngayBd);
                if (fpNgayKt) fpNgayKt.setDate(km.ngayKt);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: response.message || 'Không thể tải dữ liệu',
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi lấy thông tin:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối đến máy chủ',
            });
        }
    });
}

//hàm thêm khuyến mãi
function ThemKhuyenMai() {
    const tenKm = $('#tenChuongTrinhKhuyenMai').val().trim();
    const giamGia = Number($('#giamGiaKhuyenMai').val());
    const ngayBd = $('#ngayBatDauChuongTrinh').val();
    const ngayKt = $('#ngayKetThucChuongTrinh').val();

    const km = {
        TenKm: tenKm,
        GiamGia: giamGia,
        NgayBd: ngayBd,
        NgayKt: ngayKt
    };

    $.ajax({
        url: '/ChuSanBong/KhuyenMai/AddKhuyenMai',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(km),
        success: function (resp) {
            if (resp.success) {
                $('#themKhuyenMaiModal').modal('hide'); // Đóng modal
                hienThiDanhSachKM(); // Cập nhật danh sách nếu có
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: resp.message || 'Đã thêm khuyến mãi mới!'
                });
            } else {
                $('#themKhuyenMaiModal').modal('hide');
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: resp.message || 'Thêm khuyến mãi thất bại'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi thêm khuyến mãi:', error);
            $('#themKhuyenMaiModal').modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối tới máy chủ'
            });
        }
    });
}

//hàm xóa khuyến mãi
function deleteKM(id) {
    Swal.fire({
        title: 'Bạn có chắc muốn xóa?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Vâng, xóa đi!',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/ChuSanBong/KhuyenMai/DeleteKhuyenMai',
                type: 'POST',
                data: { id: id },  // gửi form-encoded để ASP.NET bind vào param `id`
                success: function (resp) {
                    if (resp.success) {
                        // Reload lại danh sách
                        hienThiDanhSachKM();
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
                    console.error('Lỗi khi xóa:', error);
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

//hàm sửa khuyến mãi
function UpdateKM() {
    const id = Number($('#editMaKm').val());
    const tenCT = $('#tenChuongTrinhKhuyenMaiSua').val().trim();
    const ngayBD = $('#ngayBatDauChuongTrinhSua').val().trim();
    const ngayKT = $('#ngayKetThucChuongTrinhSua').val().trim();
    const giamGia = Number($('#giamGiaSua').val());

    const km = {
        maKm: id,
        tenKm: tenCT,
        NgayBd: ngayBD,
        NgayKt: ngayKT,
        GiamGia: giamGia
    };
    $.ajax({
        url: '/ChuSanBong/KhuyenMai/UpdateKhuyenMai',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(km),
        success: function (resp) {
            if (resp.success) {
                $('#suaKhuyenMaiModal').modal('hide');
                hienThiDanhSachKM(); // Hàm này bạn cần có sẵn
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: resp.message
                });
            } else {
                $('#suaKhuyenMaiModal').modal('hide');
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: resp.message
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi cập nhật khuyến mãi:', error);
            $('#suaKhuyenMaiModal').modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối tới máy chủ'
            });
        }
    });
}

//hàm update trạng thái KM
function updateTrangKhuyenMai() {
    $.ajax({
        url: '/ChuSanBong/KhuyenMai/ChangeStatusAllKhuyenMai', // Đường dẫn API của bạn
        type: 'POST',
        success: function (response) {
            hienThiDanhSachKM();
        },
        error: function (xhr, error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
        }
    });
}

//5 tiếng gọi hàm 1 lần 
setInterval(updateTrangKhuyenMai, 5 * 60 * 1000);

$(document).ready(function () {
    hienThiDanhSachKM();
    updateTrangKhuyenMai()
});
