$(document).ready(function () {
    let currentPage = 1; // Trang hiện tại
    let pageSize = 10; // Số lượng bản ghi mỗi trang

    LoadDanhSachDatSan(currentPage, pageSize);

    function LoadDanhSachDatSan(page, size) {
        $.ajax({
            url: '/Admin/HoaDon/DanhSachLichSu',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data)
                let tableBody = $("#danhSachHoaDonTable");
                tableBody.empty();

                if (data.expired) {
                    // Bị chặn, không làm gì nữa
                    return;
                }

                if (data.length === 0) {
                    tableBody.append(`<tr><td colspan="7" class="text-center">Không có dữ liệu</td></tr>`);
                    $("#pagination-KhachHang").empty();
                    return;
                }

                // Tính toán phân trang
                let startIndex = (page - 1) * size;
                let endIndex = Math.min(startIndex + size, data.length);
                let paginatedData = data.slice(startIndex, endIndex);

                // Hiển thị dữ liệu lên bảng
                $.each(paginatedData, function (index, datSan) {
                    let row = `<tr>
                        <th scope="row">${startIndex + index + 1}</th>
                        <td>${datSan.tenChuSan}</td>
                        <td>${datSan.tenSan}</td>
                        <td>${datSan.thoiHan}</td>
                        <td>${datSan.ngayThanhToan}</td>
                        <td>${datSan.tongTien.toLocaleString('vi-VN')} VND</td>
                    </tr>`;
                    tableBody.append(row);
                });

                // Render phân trang
                renderPagination(data.length, page, size);
            },
            error: function (xhr, status, error) {
                console.error("Lỗi AJAX:", status, error);
                alert("Lỗi khi tải danh sách đặt sân.");
            }
        });
    }

    function renderPagination(totalRecords, currentPage, pageSize) {
        let totalPages = Math.ceil(totalRecords / pageSize);
        let pagination = $("#pagination-KhachHang");
        pagination.empty();

        if (totalPages <= 1) return;

        let prevDisabled = currentPage === 1 ? 'disabled' : '';
        pagination.append(`<li class="page-item ${prevDisabled}"><a class="page-link" href="#" data-page="${currentPage - 1}">«</a></li>`);

        for (let i = 1; i <= totalPages; i++) {
            let activeClass = currentPage === i ? 'active' : '';
            pagination.append(`<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
        }

        let nextDisabled = currentPage === totalPages ? 'disabled' : '';
        pagination.append(`<li class="page-item ${nextDisabled}"><a class="page-link" href="#" data-page="${currentPage + 1}">»</a></li>`);
    }

    $(document).on("click", "#pagination-KhachHang .page-link", function (e) {
        e.preventDefault();
        let page = parseInt($(this).attr("data-page"));
        if (!isNaN(page)) {
            currentPage = page;
            LoadDanhSachDatSan(currentPage, pageSize);
        }
    });

    //hàm tìm kiếm 
    function TimKiemKhachHang() {
        let keyword = $("#searchHoaDon").val().toLowerCase();

        $("#danhSachHoaDonTable tr").each(function () {
            let rowText = $(this).text().toLowerCase(); // Lấy toàn bộ nội dung hàng
            if (rowText.includes(keyword)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $('#searchHoaDon').keyup(function () {
        TimKiemKhachHang();
    });
});

function showWarning() {
    toastr.warning("Bạn chưa nhập thông tin!", "", {
        timeOut: 1000 // Hiển thị trong 1 giây
    });
}