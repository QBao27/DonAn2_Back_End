//Kiem tra so dien thoai trong chuc nang tra cuu
function validatePhoneNumber() {
    // Kiểm tra nếu số điện thoại chưa được nhập
    const phoneNumber = document.getElementById("SoDienThoaiTraCuu").value.trim();
    if (!phoneNumber) {
        toastr.warning("Bạn chưa nhập số điện thoại!", "", { 
            timeOut: 1000 // Giới hạn thời gian hiển thị là 1 giây
        });
        return false;
    }

    // Biểu thức chính quy để kiểm tra định dạng số điện thoại
    const phoneRegex = /^0\d{9,10}$/;
    //Kiểm tra nếu số điện thoại không hợp lệ
    if (!phoneRegex.test(phoneNumber)) {
        Swal.fire({
            icon: "error",
            title: "Lỗi nhập số điện thoại",
            text: "Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại bắt đầu bằng 0 và có 10-11 chữ số.",
            confirmButtonText: "OK",
            timer: 2000,
            customClass: {
                popup: 'custom-swal'
            }
        });
        clearPhoneNumber();
        return false;
    }

    traCuuLichSu();
    clearPhoneNumber();
    return true;
}

// <!-- xoa sdt sau khi tra cuu -->
function clearPhoneNumber() {
    const NumberInput = document.getElementById('SoDienThoaiTraCuu');
    NumberInput.value = '';
}


//hàm xử lý tra cứu
function traCuuLichSu() {
    let soDienThoai = $('#SoDienThoaiTraCuu').val().trim();
    $.ajax({
        url: "/Customer/Home/TraCuuLichSu",
        type: "GET",
        data: { soDienThoai: soDienThoai },
        dataType: 'json',
        success: function (res) {
            if (res.success) {
                let html = '';
                let html2 = '';
                res.data.forEach(function (item) {
                    html += `
                <div class="pt-2">
                    <div class="container mt-2 shadow div-hover"
                        style="background:white;border-radius: 20px; font-weight: 600 ">
                        <div class="row">
                            <div class="col-4 col-md-2 thongTinLichSuDatSan" style="padding: 15px 0px 15px 15px;">
                                <span>${item.gioDat} / ${item.ngayDat}</span>
                            </div>
                            <div class="col-4 col-md-2 thongTinLichSuDatSan" style="padding: 15px 10px 15px 0;">
                                <span>${item.tenKhachHang}</span>
                            </div>
                            <div class="col-4 col-md-2 thongTinLichSuDatSan" style="padding: 15px 0 15px 0;">
                                <span>${item.tenSan} / ${item.tenSanBong}</span>
                            </div>
                            <div class="col-2 col-md-2 thongTinLichSuDaSan" style="padding: 15px 10px 15px 10px;">
                                <span>${item.thoiLuong} Phút</span>
                            </div>
                            <div class="col-4 col-md-2 thongTinLichSuDaSan" style="padding: 15px 10px 15px 0;">
                                <span>${item.trangThaiThanhToan}</span>
                            </div>
                            <div class="col-4 col-md-2 thongTinLichSuDaSan" style="padding: 15px 0 15px 0;">
                                <span><b>${item.tongThanhToan.toLocaleString() }</b></span>
                                <b>VND</b>
                            </div>
                        </div>
                    </div>
                </div>
            `;
                    html2 += ` <div class="card mb-3 shadow-lg" style="border-radius:15px;">
                      <div class="card-body">
                        <h6 class="card-title text-primary">
                          ${item.tenKhachHang} – ${item.tenSan} / ${item.tenSanBong}
                        </h6>
                        <p class="mb-1"><b>Thời gian đặt:</b> ${item.gioDat} / ${item.ngayDat}</p>
                        <p class="mb-1"><b>Thời lượng:</b> ${item.thoiLuong} phút</p>
                        <p class="mb-1"><b>Trạng thái:</b>
                          <span class="${item.trangThaiThanhToan === 'Đã thanh toán' ? 'text-success' : 'text-danger'}">
                            ${item.trangThaiThanhToan}
                          </span>
                        </p>
                        <p class="mb-1"><b>Tổng thanh toán:</b> ${item.tongThanhToan.toLocaleString()} VND</p>
                      </div>
                    </div>`
                });
                $('#tblBodyLichSuDatPhong').html(html);
                $('#cardThongTinDatSanMobile').html(html2);
                const myModal = new bootstrap.Modal(document.getElementById('LichSuDatSan'));
                myModal.show();
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Bạn chưa đặt sân",
                    text: res.message,
                    confirmButtonText: "OK",
                    timer: 2000,
                    customClass: {
                        popup: 'custom-swal'
                    }
                });
            }
        },
        error: function (xhr, status, err) {
            console.error(res.message + " - " + err);
        }
    });
}