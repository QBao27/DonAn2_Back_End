function runScripts() {
    // Tìm tất cả các thẻ script trong nội dung mới
    var scripts = document.querySelectorAll('#content script');
    scripts.forEach(function (script) {
        // Tạo một thẻ script mới
        var newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;  // Nếu script có src, gán src
        } else {
            newScript.textContent = script.textContent;  // Nếu script có nội dung, gán nội dung
        }
        document.body.appendChild(newScript); // Thêm thẻ script vào body để thực thi
    });
}

function loadContent(url) {
    var xhr = new XMLHttpRequest();  // Tạo đối tượng XMLHttpRequest

    xhr.open('GET', url, true);  // Thiết lập yêu cầu GET tới URL

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Khi yêu cầu hoàn tất và thành công, thay đổi nội dung
                document.getElementById('content').innerHTML = xhr.responseText;
                runScripts(); // Gọi hàm để chạy các script
            } else {
                // Xử lý lỗi nếu không tải được trang
                document.getElementById('content').innerHTML = "<p>Failed to load content. Please try again.</p>";
            }
        }
    };

    xhr.send();  // Gửi yêu cầu AJAX
}

function showSweetAlert() {
    Swal.fire({
        title: 'Thành công!',
        text: 'Dữ liệu đã được lưu.',
        icon: 'success', // success, error, warning, info, question
        confirmButtonText: 'OK',
        customClass: {
            popup: 'custom-swal'
        }
    });
}


// Hàm kiểm tra lỗi khi nhấn nút
function KiemTraLoi() {
    let isValid = true;

    // Lấy giá trị từ các input
    let tenSan = document.getElementById("tenSan");
    let gia = document.getElementById("gia");
    let loaiSan = document.getElementById("LoaiSan");

    let errortenSan = document.getElementById("errortenSan");
    let errorGia = document.getElementById("errorGia");
    let errorLoaiSan = document.getElementById("ErrorLoaiSan");

    // Xóa thông báo lỗi trước khi kiểm tra
    errortenSan.textContent = "";
    errorGia.textContent = "";
    errorLoaiSan.textContent = "";

    // Kiểm tra tên sân
    if (tenSan.value.trim() === "") {
        errortenSan.textContent = "Vui lòng nhập tên sân.";
        isValid = false;
    }

    // Kiểm tra giá sân
    if (gia.value.trim() === "" || isNaN(gia.value) || gia.value <= 0) {
        errorGia.textContent = "Vui lòng nhập giá hợp lệ.";
        isValid = false;
    }

    // Kiểm tra loại sân
    if (loaiSan.value === "") {
        errorLoaiSan.textContent = "Vui lòng chọn loại sân.";
        isValid = false;
    }

    // Nếu hợp lệ thì gọi hàm showSweetAlert() và reset dữ liệu
    if (isValid) {
        showSweetAlert();

        // Xóa dữ liệu sau khi nhập thành công
        tenSan.value = "";
        gia.value = "";
        loaiSan.value = "";
    }
    else {

        toastr.warning("Bạn chưa nhập thông tin!", "", {
            timeOut: 1000 // Giới hạn thời gian hiển thị là 1 giây
        });

    }
}

function KiemTraLoiSua() {
    let isValid = true;

    // Lấy giá trị từ các input
    let tenSan = document.getElementById("EdittenSan");
    let gia = document.getElementById("Editgia");
    let loaiSan = document.getElementById("EditloaiSan");

    let errortenSan = document.getElementById("EditerrorTenSan");
    let errorGia = document.getElementById("EditerrorGia");
    let errorLoaiSan = document.getElementById("EditErrorLoaiSan");

    // Xóa thông báo lỗi trước khi kiểm tra
    errortenSan.textContent = "";
    errorGia.textContent = "";
    errorLoaiSan.textContent = "";

    // Kiểm tra tên sân
    if (tenSan.value.trim() === "") {
        errortenSan.textContent = "Vui lòng nhập tên sân.";
        isValid = false;
    }

    // Kiểm tra giá sân
    if (gia.value.trim() === "" || isNaN(gia.value) || gia.value <= 0) {
        errorGia.textContent = "Vui lòng nhập giá hợp lệ.";
        isValid = false;
    }

    // Kiểm tra loại sân
    if (loaiSan.value === "") {
        errorLoaiSan.textContent = "Vui lòng chọn loại sân.";
        isValid = false;
    }


    // Nếu hợp lệ thì gọi hàm showSweetAlert() và đóng modal
    if (isValid) {
        showSweetAlert();

        // Xóa dữ liệu sau khi nhập thành công
        tenSan.value = "";
        gia.value = "";
        loaiSan.value = "";
    }
    else {
        toastr.warning("Bạn chưa nhập số điện thoại!", "", {
            timeOut: 1000 // Giới hạn thời gian hiển thị là 1 giây
        });
    }
}

function HienThiThongBaoXoa() {
    Swal.fire({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            // Nếu chọn "Xóa", hiển thị thông báo thành công
            toastr.success("Xóa thành công!", "Thông báo");
        }
    });
}

function KiemTraLoiDatSan() {
    let isValid = true;

    // Lấy giá trị từ các input
    let hoTen = document.getElementById("hovatenDatSan");
    let soDienThoai = document.getElementById("SoDienThoaiDatSan");
    let ngayDat = document.getElementById("NgayDatSan");
    let gioDat = document.getElementById("GioDatSan");
    let thoiLuong = document.getElementById("ThoiLuongDatSan");

    let errorHoTen = document.getElementById("hovatenDatSanError");
    let errorSoDienThoai = document.getElementById("SoDienThoaiDatSanError");
    let errorNgayDat = document.getElementById("NgayDatSanError");
    let errorGioDat = document.getElementById("GioDatSanError");
    let errorThoiLuong = document.getElementById("ThoiLuongDatSanError");

    // Xóa thông báo lỗi trước khi kiểm tra
    errorHoTen.textContent = "";
    errorSoDienThoai.textContent = "";
    errorNgayDat.textContent = "";
    errorGioDat.textContent = "";
    errorThoiLuong.textContent = "";

    // Kiểm tra họ tên
    if (hoTen.value.trim() === "") {
        errorHoTen.textContent = "Vui lòng nhập họ tên.";
        isValid = false;
    }

    // Kiểm tra số điện thoại (phải là 10 số)
    let phoneRegex = /^[0-9]{10}$/;
    if (soDienThoai.value.trim() === "") {
        errorSoDienThoai.textContent = "Vui lòng nhập số điện thoại.";
        isValid = false;
    } else if (!phoneRegex.test(soDienThoai.value)) {
        errorSoDienThoai.textContent = "Số điện thoại không hợp lệ.";
        isValid = false;
    }
    // Nếu hợp lệ thì hiển thị thông báo và xóa dữ liệu
    if (isValid) {
        showSweetAlert();

        // Xóa dữ liệu sau khi nhập thành công
        hoTen.value = "";
        soDienThoai.value = "";
        ngayDat.value = "";
        gioDat.value = "";
        thoiLuong.value = "";
    } else {
        toastr.warning("Vui lòng kiểm tra lại thông tin!", "", {
            timeOut: 1000 // Giới hạn thời gian hiển thị là 1 giây
        });
    }
}






