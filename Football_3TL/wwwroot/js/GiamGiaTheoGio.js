
let gioMoCuaGoc = null;
let gioDongCuaGoc = null;
function loadGioMoCuaVaDongCua() {
    $.ajax({
        url: '/ChuSanBong/GiaKhuyenMai/GetGioMoVaDongCua',
        type: 'GET',
        success: function (res) {
            if (res.success) {
                gioMoCuaGoc = res.gioMoCua;
                gioDongCuaGoc = res.gioDongCua;

                applyGioMoDong(gioMoCuaGoc, gioDongCuaGoc);

                // Sự kiện chọn giờ mở cửa
                // Sự kiện chọn giờ mở cửa
                $('#openingTime').off('change').on('change', function () {
                    var mo = parseInt($(this).val());
                    var dong = parseInt($('#closingTime').val());
                    filterClosingTime(mo, gioDongCuaGoc);

                    if (dong <= mo) {
                        $('#closingTime').val(mo + 1);
                    }
                });

                // Sự kiện chọn giờ đóng cửa
                $('#closingTime').off('change').on('change', function () {
                    var dong = parseInt($(this).val());
                    var mo = parseInt($('#openingTime').val());
                    filterOpeningTime(gioMoCuaGoc, dong);

                    if (mo >= dong) {
                        $('#openingTime').val(dong - 1);
                    }
                });
            } else {
                alert(res.message);
            }
        },
        error: function () {
            alert('Lỗi khi lấy dữ liệu.');
        }
    });
}

// Áp dụng ban đầu
function applyGioMoDong(mo, dong) {
    $('#openingTime').val(mo);
    $('#closingTime').val(dong);

    filterOpeningTime(mo, dong);
    filterClosingTime(mo, dong);
}



// Lọc giờ đóng cửa: từ (giờ mở + 1) đến giờ đóng gốc
function filterClosingTime(mo, dong) {
    $('#closingTime option').each(function () {
        var val = parseInt($(this).val());
        if (val <= mo || val > dong) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function filterOpeningTime(mo, dong) {
    $('#openingTime option').each(function () {
        var val = parseInt($(this).val());
        if (val < mo || val >= dong) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}


$(document).ready(function () {
    loadGioMoCuaVaDongCua();
});
function resetKhuyenMaiModal() {
    if (gioMoCuaGoc !== null && gioDongCuaGoc !== null) {
        applyGioMoDong(gioMoCuaGoc, gioDongCuaGoc);
    }

    $('#GiogiamGia').val('');
    $('#ErrorGiogiamGia').text('');
}

$('#themGioKhuyenMaiModal').on('hidden.bs.modal', function () {
    resetKhuyenMaiModal();
});

function kiemTraKhuyenMai() {
    // Lấy giá trị nhập
    var giamGia = $('#GiogiamGia').val().trim();
    var gioMo = parseInt($('#openingTime').val());
    var gioDong = parseInt($('#closingTime').val());
    var loi = '';

    // Kiểm tra giảm giá
    if (giamGia === '') {
        loi = 'Vui lòng nhập phần trăm giảm giá!';
    } else {
        var giaTri = parseFloat(giamGia);
        if (isNaN(giaTri) || giaTri <= 0) {
            loi = 'Phần trăm giảm giá không hợp lệ!';
        } else if (giaTri > 80) {
            loi = 'Phần trăm giảm giá không được vượt quá 80%!'; // Bạn tự đặt max 80%
        }
    }

    // Kiểm tra logic giờ
    if (gioMo >= gioDong) {
        loi = 'Giờ mở cửa phải nhỏ hơn giờ đóng cửa!';
    }

    // Nếu có lỗi, hiển thị
    if (loi !== '') {
        $('#ErrorGiogiamGia').text(loi);
        return false; // Ngưng xử lý
    }

    $('#ErrorGiogiamGia').text(''); // Xóa lỗi nếu không còn lỗi

    // ✅ Tạo dữ liệu JSON chuẩn
    var data = {
        GioBd: gioMo.toString().padStart(2, '0') + ":00:00", // "08:00:00"
        GioKt: gioDong.toString().padStart(2, '0') + ":00:00", // "12:00:00"
        GiamGia: parseFloat(giamGia)
    };
    // ✅ Gửi AJAX
    $.ajax({
        url: '/ChuSanBong/GiaKhuyenMai/ThemMoi',
        type: 'POST',
        contentType: 'application/json', // BẮT BUỘC để ASP.NET bind [FromBody]
        data: JSON.stringify(data),
        success: function (res) {
            if (res.success) {
                showSweetAlert('Thành công!', res.message, 'success');
                $('#themGioKhuyenMaiModal').modal('hide');
                resetKhuyenMaiModal();
                loadKhuyenMai()
                // TODO: reload danh sách, hoặc reset form...
            } else {
                showSweetAlert('Lỗi!', res.message, 'error');
            }
        },
        error: function (xhr, status, error) {
            console.log('❌ AJAX ERROR');
            console.log('Status:', status);
            console.log('Error:', error);
            console.log('Response Text:', xhr.responseText);
            alert('Lỗi khi thêm chương trình.');
        }
    });

    return false; // Ngăn submit form mặc định nếu bạn gắn sự kiện `onsubmit`
}

function loadKhuyenMai() {
    $.ajax({
        url: '/ChuSanBong/GiaKhuyenMai/LayTatCa',
        type: 'GET',
        success: function (res) {
            if (res.success) {
                var html = '';
                var stt = 1;

                res.data.forEach(function (item) {
                    var trangThaiClass = item.trangThai === 'Đang áp dụng' ? 'text-success' : 'text-secondary';

                    html += `
                    <tr>
                        <th scope="row">${stt++}</th>
                        <td>${item.gioBd}</td>
                        <td>${item.gioKt}</td>
                        <td>${item.giamGia} %</td>
                        <td class="${trangThaiClass}">${item.trangThai}</td>
                        <td class="d-flex justify-content-end">
                            <button type="button" class="btn btn-warning me-2" onclick="suaChuongTrinhKhuyenMaiModal(${item.maGiamGia})">Sửa</button>
                            <button type="button" class="btn btn-danger" onclick="xoaChuongTrinhKhuyenMai(${item.maGiamGia})">Xóa</button>
                        </td>
                    </tr>`;
                });

                $('#tableKhuyenMai').html(html);
            } else {
                alert(res.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('❌ AJAX lỗi:', error);
            alert('Không thể tải dữ liệu khuyến mãi.');
        }
    });
}

function kiemTraKhuyenMaiSua() {
    var giamGia = $('#GiogiamGiaSua').val().trim();
    var gioMo = parseInt($('#openingTimeSua').val());
    var gioDong = parseInt($('#closingTimeSua').val());
    var id = $('#IdSua').val();
    var loi = '';

    if (giamGia === '') {
        loi = 'Vui lòng nhập phần trăm giảm giá!';
    } else {
        var giaTri = parseFloat(giamGia);
        if (isNaN(giaTri) || giaTri <= 0) {
            loi = 'Phần trăm giảm giá không hợp lệ!';
        } else if (giaTri > 80) {
            loi = 'Phần trăm giảm giá không được vượt quá 80%!';
        }
    }

    if (loi !== '') {
        $('#ErrorGiogiamGiaSua').text(loi);
        return false;
    } else {
        $('#ErrorGiogiamGiaSua').text('');

        // Gọi AJAX sửa
        var data = {
            Id: id,
            GioBd: gioMo.toString().padStart(2, '0') + ":00:00", // "08:00:00"
            GioKt: gioDong.toString().padStart(2, '0') + ":00:00", // "12:00:00"
            GiamGia: giaTri
        };

        console.log(data);

        $.ajax({
            url: '/ChuSanBong/GiaKhuyenMai/CapNhat',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (res) {
                if (res.success) {
                    showSweetAlert('Thành công!', res.message, 'success');
                    $('#suaGioKhuyenMaiModal').modal('hide');
                    loadKhuyenMai();
                } else {
                    showSweetAlert('Lỗi!', res.message, 'error');
                }
            },
            error: function () {
                console.log('❌ AJAX ERROR');
                console.log('Status:', status);
                console.log('Error:', error);
                console.log('Response Text:', xhr.responseText);
                alert('Lỗi khi cập nhật.');
            }
        });
    }
}

function resetKhuyenMaiSuaModal() {
    $('#IdSua').val('');
    $('#openingTimeSua').val(0);
    $('#closingTimeSua').val(0);
    $('#GiogiamGiaSua').val('');
    $('#ErrorGiogiamGiaSua').text('');
}

//function suaChuongTrinhKhuyenMaiModal(id) {
//    $.ajax({
//        url: '/ChuSanBong/GiaKhuyenMai/GetById', // 👉 Controller phải có GetById
//        type: 'GET',
//        data: { id: id },
//        success: function (res) {
//            if (res.success) {
//                var km = res.data;

//                // Gán giá trị lên modal
//                $('#IdSua').val(km.maGiamGia);
//                $('#openingTimeSua').val(parseInt(km.gioBd.split(':')[0]));
//                $('#closingTimeSua').val(parseInt(km.gioKt.split(':')[0]));
//                $('#GiogiamGiaSua').val(km.giamGia);

//                // Mở modal
//                $('#suaGioKhuyenMaiModal').modal('show');
//            } else {
//                alert(res.message);
//            }
//        },
//        error: function () {
//            alert('Lỗi khi lấy dữ liệu.');
//        }
//    });
//}

function suaChuongTrinhKhuyenMaiModal(id) {
    $.ajax({
        url: '/ChuSanBong/GiaKhuyenMai/GetById',
        type: 'GET',
        data: { id: id },
        success: function (res) {
            if (res.success) {
                var km = res.data;

                // 👉 Load giờ mở/đóng mặc định trước
                $.ajax({
                    url: '/ChuSanBong/GiaKhuyenMai/GetGioMoVaDongCua',
                    type: 'GET',
                    success: function (gioRes) {
                        if (gioRes.success) {
                            var gioMo = gioRes.gioMoCua;
                            var gioDong = gioRes.gioDongCua;

                            // Áp dụng filter cho modal SỬA
                            applyGioMoDong_Sua(gioMo, gioDong);

                            // ✅ Gán lại giá trị đang chỉnh
                            $('#IdSua').val(km.maGiamGia);

                            var gioBd = parseInt(km.gioBd.split(':')[0]);
                            var gioKt = parseInt(km.gioKt.split(':')[0]);

                            $('#openingTimeSua').val(gioBd);
                            $('#closingTimeSua').val(gioKt);
                            $('#GiogiamGiaSua').val(km.giamGia);

                            // Bắt sự kiện lọc giống THÊM
                            $('#openingTimeSua').off('change').on('change', function () {
                                var mo = parseInt($(this).val());
                                var dong = parseInt($('#closingTimeSua').val());
                                filterClosingTime_Sua(mo, gioDong);

                                if (dong <= mo) {
                                    $('#closingTimeSua').val(mo + 1);
                                }
                            });

                            $('#closingTimeSua').off('change').on('change', function () {
                                var dong = parseInt($(this).val());
                                var mo = parseInt($('#openingTimeSua').val());
                                filterOpeningTime_Sua(gioMo, dong);

                                if (mo >= dong) {
                                    $('#openingTimeSua').val(dong - 1);
                                }
                            });

                            // ✅ Mở modal sửa
                            $('#suaGioKhuyenMaiModal').modal('show');

                        } else {
                            alert('Không lấy được giờ mở/đóng cửa gốc.');
                        }
                    },
                    error: function () {
                        alert('Lỗi khi lấy giờ mở/đóng cửa.');
                    }
                });
            } else {
                alert(res.message);
            }
        },
        error: function () {
            alert('Lỗi khi lấy dữ liệu.');
        }
    });
}


function applyGioMoDong_Sua(mo, dong) {
    filterOpeningTime_Sua(mo, dong);
    filterClosingTime_Sua(mo, dong);
}

function filterClosingTime_Sua(mo, dong) {
    $('#closingTimeSua option').each(function () {
        var val = parseInt($(this).val());
        if (val <= mo || val > dong) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function filterOpeningTime_Sua(mo, dong) {
    $('#openingTimeSua option').each(function () {
        var val = parseInt($(this).val());
        if (val < mo || val >= dong) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}


$(document).ready(function () {
    loadKhuyenMai();
});


function xoaChuongTrinhKhuyenMai(id) {
    Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: 'Hành động này sẽ xóa chương trình giảm giá!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        reverseButtons: true,
        customClass: {
            popup: 'custom-swal'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/ChuSanBong/GiaKhuyenMai/Xoa',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(id),
                success: function (res) {
                    if (res.success) {
                        showSweetAlert('Thành công!', res.message, 'success');
                        loadKhuyenMai(); // reload lại bảng
                    } else {
                        showSweetAlert('Lỗi', res.message, 'error');
                    }
                },
                error: function () {
                    showSweetAlert('Lỗi', 'Xóa thất bại, vui lòng thử lại.', 'error');
                }
            });
        }
    });
}



function showSweetAlert(title, message, icon) {
    Swal.fire({
        title: title,
        text: message,
        icon: icon, // success, error, warning, info, question
        confirmButtonText: 'OK',
        customClass: {
            popup: 'custom-swal'
        }
    });
}

