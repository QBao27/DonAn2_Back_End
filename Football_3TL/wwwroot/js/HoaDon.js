$(document).ready(function () {
    let currentPage = 1; // Trang hiện tại
    let pageSize = 8; // Số lượng bản ghi mỗi trang

    LoadDanhSachHoaDon(currentPage, pageSize);

    function LoadDanhSachHoaDon(page, size) {
        $.ajax({
            url: '/ChuSanBong/HoaDon/DanhSachHoaDon',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data)
                let tableBody = $("#HoaDonTable");
                tableBody.empty();

                if (data.length === 0) {
                    tableBody.append(`<tr><td colspan="6" class="text-center">Không có dữ liệu</td></tr>`);
                    $("#pagination-HoaDon").empty();
                    return;
                }

                // Tính toán phân trang
                let startIndex = (page - 1) * size;
                let endIndex = Math.min(startIndex + size, data.length);
                let paginatedData = data.slice(startIndex, endIndex);

                // Hiển thị dữ liệu lên bảng
                $.each(paginatedData, function (index, hoaDon) {
                    let row = `<tr>
                        <th scope="row">${startIndex + index + 1}</th>
                        <td>${hoaDon.maHoaDon}</td>
                        <td>${hoaDon.thoiGianLapHoaDon}</td>
                        <td>${hoaDon.tenSan}</td>
                        <td>${hoaDon.tenKhachHang}</td>
                        <td>${hoaDon.thoiGianDatSan}</td>
                        <td>${hoaDon.tongGiaTri}</td>
                    </tr>`;
                    tableBody.append(row);
                });

                // Render phân trang
                renderPagination(data.length, page, size);
            },
            error: function (xhr, status, error) {
                console.error("Lỗi AJAX:", status, error);
                alert("Lỗi khi tải danh sách hóa đơn.");
            }
        });
    }

    function renderPagination(totalRecords, currentPage, pageSize) {
        let totalPages = Math.ceil(totalRecords / pageSize);
        let pagination = $("#pagination-HoaDon");
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

    $(document).on("click", "#pagination-HoaDon .page-link", function (e) {
        e.preventDefault();
        let page = parseInt($(this).attr("data-page"));
        if (!isNaN(page)) {
            currentPage = page;
            LoadDanhSachHoaDon(currentPage, pageSize);
        }
    });
});
