let chuSanList = [];
let currentPage = 1;
const itemsPerPage = 5;

function loadChuSanData() {
    $.ajax({
        url: '/Admin/QuanLyTaiKhoan/GetAllChuSan',
        type: 'GET',
        success: function (data) {
            chuSanList = data;
            currentPage = 1;
            renderChuSanTable();
            renderChuSanPagination();
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi tải dữ liệu chủ sân:', xhr.responseText);
            alert('Lỗi khi tải dữ liệu chủ sân.');
        }
    });
}

function renderChuSanTable() {
    let tableBody = '';
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let displayedItems = chuSanList.slice(startIndex, endIndex);

    $.each(displayedItems, function (index, item) {
        tableBody += `
            <tr>
                <th scope="row">${startIndex + index + 1}</th>
                <td>${item.hoVaTen}</td>
                <td>${item.tenSanBong}</td>
                <td>${item.soDienThoai}</td>
                <td>${item.email}</td>
                <td>
                    <a class="cusor me-2 mt-1 d-flex data-id="${item.maChuSan}" justify-content-end data-bs-toggle="modal"
                       data-bs-target="#Thongtin1" onclick="loadChuSanChiTiet(${item.maChuSan})""
                       style="color: darkblue; font-style: italic; text-decoration: underline;">
                        Chi tiết
                    </a>
                    <button type="button" class="btn btn-warning me-2" data-bs-toggle="modal"
                                                data-bs-target="#sua" data-bs-dismiss="modal">Mở tài khoản</button>
                </td>
            </tr>`;
    });

    $('#chuSanTableBody').html(tableBody);
}

function renderChuSanPagination() {
    let totalPages = Math.ceil(chuSanList.length / itemsPerPage);
    let html = '';

    if (totalPages > 1) {
        html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeChuSanPage(${currentPage - 1})">«</a>
                 </li>`;

        for (let i = 1; i <= totalPages; i++) {
            html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="changeChuSanPage(${i})">${i}</a>
                     </li>`;
        }

        html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeChuSanPage(${currentPage + 1})">»</a>
                 </li>`;
    }

    $('#chuSanPagination').html(html);
}

function changeChuSanPage(page) {
    let totalPages = Math.ceil(chuSanList.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderChuSanTable();
        renderChuSanPagination();
    }


}
function loadChuSanChiTiet(id) {
    $.ajax({
        url: `/Admin/QuanLyTaiKhoan/GetChuSanById?id=${id}`,
        type: 'GET',
        success: function (data) {
            console.log(data)
            $('#ct-hoVaTen').text(data.hoVaTen);
            $('#ct-soDienThoai').text(data.soDienThoai);
            $('#ct-tenSanBong').text(data.tenSanBong);
            $('#ct-email').text(data.email);

            const diaChi = `${data.diaChi}, ${data.xa}, ${data.huyen}, ${data.tinh}`;
            $('#ct-diaChi').text(diaChi);

            // Hiển thị modal
            $("#Thongtin1").modal("show");
        },
        error: function () {
            alert('Không thể lấy thông tin chi tiết chủ sân.');
        }
    });
}

$(document).on('click', '.btn-show-detail', function () {
    const id = $(this).data('id');
    loadChuSanChiTiet(id);
});





// Gọi hàm khi trang vừa load
$(document).ready(function () {
    loadChuSanData();
});
