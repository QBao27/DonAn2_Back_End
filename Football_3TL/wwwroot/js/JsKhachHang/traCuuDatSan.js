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
    else {
        const myModal = new bootstrap.Modal(document.getElementById('LichSuDatSan'));
        myModal.show();
        clearPhoneNumber();
    }
    return true;
}

// <!-- xoa sdt sau khi tra cuu -->
function clearPhoneNumber() {
    const NumberInput = document.getElementById('SoDienThoaiTraCuu');
    NumberInput.value = '';
}
