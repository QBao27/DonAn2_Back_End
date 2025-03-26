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
    $("#diaChiTinhTimKiem", "#diaChiHuyenTimKiem").select2(); // Kích hoạt Select2
    // Lấy danh sách tỉnh/thành
    $.get("https://provinces.open-api.vn/api/?depth=1")
        .done(function (data) {
            let object = '<option value="">-- Tỉnh Thành --</option>';  // Khởi tạo chuỗi rỗng để lưu các <option>
            $("#diaChiHuyenTimKiem").empty().append('<option value="">-- Quận Huyện --</option>');
            $.each(data, function (index, province) { // Sử dụng (index, province) thay vì (item)
                object += `
                <option value="${province.code}">${province.name}</option>
            `;
            });
            $('#diaChiTinhTimKiem').html(object); // Gán danh sách tỉnh vào <select>
        })
        .fail(function () {
            console.error("Không thể tải danh sách tỉnh thành");
        });

    // Khi chọn tỉnh, lấy danh sách quận/huyện
    $("#diaChiTinhTimKiem").change(function () {
        $("#diaChiHuyenTimKiem").empty().append('<option value="">-- Quận huyện --</option>');
        let provinceCode = $(this).val();
        if (provinceCode) {
            $.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
                .done(function (data) {
                    $("#diaChiHuyenTimKiem").append(data.districts.map(district =>
                        `<option value="${district.code}">${district.name}</option>`
                    ));
                })
                .fail(function () {
                    console.error("Không thể tải danh sách quận huyện");
                });
        }
    });
});