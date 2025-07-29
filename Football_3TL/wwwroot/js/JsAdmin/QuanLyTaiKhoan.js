let chuSanList = [];
let currentPage = 1;
const itemsPerPage = 8;

function loadChuSanData() {
    $.ajax({
        url: '/Admin/QuanLyTaiKhoan/GetAllChuSan',
        type: 'GET',
        success: function (data) {
            console.log(data)
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

//function renderChuSanTable() {
//    let tableBody = '';
//    let startIndex = (currentPage - 1) * itemsPerPage;
//    let endIndex = startIndex + itemsPerPage;
//    let displayedItems = chuSanList.slice(startIndex, endIndex);

//    $.each(displayedItems, function (index, item) {
//        tableBody += `
//            <tr>
//                <th scope="row">${startIndex + index + 1}</th>
//                <td>${item.hoVaTen}</td>
//                <td>${item.tenSanBong}</td>
//                <td>${item.soDienThoai}</td>
//                <td>${item.email}</td>
//                <td class="d-flex justify-content-center">
//                    <a class="cusor me-2 mt-1 d-flex data-id="${item.maChuSan}" justify-content-end data-bs-toggle="modal"
//                       data-bs-target="#Thongtin1" onclick="loadChuSanChiTiet(${item.maChuSan})""
//                       style="color: darkblue; font-style: italic; text-decoration: underline;">
//                        Chi tiết
//                    </a>
//                    <button type="button" class="btn btn-danger ms-2" data-bs-toggle="modal"
//                                                data-bs-target="#" data-bs-dismiss="modal">Khóa tài khoản</button>
//                </td>
//            </tr>`;
//    });

//    $('#chuSanTableBody').html(tableBody);
//}

function renderChuSanTable() {
    let tableBody = '';
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let displayedItems = chuSanList.slice(startIndex, endIndex);

    $.each(displayedItems, function (index, item) {
        // kiểm tra trạng thái
        let buttonAction = '';
        if (item.trangThai == '1') {
            buttonAction = `
                <button type="button" style="width:143px" class="btn btn-success ms-2" data-id="${item.maChuSan}" onclick="MoTaiKhoan(${item.maChuSan})">
                    Mở tài khoản
                </button>`;
        } else {
            buttonAction = `
                <button type="button" class="btn btn-danger ms-2" data-id="${item.maChuSan}" onclick="KhoaTaiKhoan(${item.maChuSan})">
                    Khóa tài khoản
                </button>`;
        }

        tableBody += `
            <tr>
                <th scope="row">${startIndex + index + 1}</th>
                <td>${item.hoVaTen}</td>
                <td>${item.tenSanBong}</td>
                <td>${item.soDienThoai}</td>
                <td>${item.email}</td>
                <td class="d-flex justify-content-center">
                    <a class="cusor me-2 mt-1 d-flex data-id="${item.maChuSan}" justify-content-end data-bs-toggle="modal"
                       data-bs-target="#Thongtin1" onclick="loadChuSanChiTiet(${item.maChuSan})"
                       style="color: darkblue; font-style: italic; text-decoration: underline;">
                        Chi tiết
                    </a>
                    ${buttonAction}
                </td>
            </tr>`;
    });

    $('#chuSanTableBody').html(tableBody);
}

function MoTaiKhoan(maChuSan) {
    Swal.fire({
        title: "Bạn có chắc chắn muốn mở tài khoản?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Mở",
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/Admin/QuanLyTaiKhoan/MoTaiKhoan", // tên hàm controller mới
                type: "POST",
                data: { maChuSan: maChuSan },
                success: function (response) {
                    if (response.success) {
                        Swal.fire("Thành công!", response.message, "success");
                        loadChuSanData(); // Gọi lại load danh sách nếu có
                    } else {
                        toastr.error(response.message);
                    }
                },
                error: function () {
                    toastr.error("Có lỗi xảy ra khi mở tài khoản.");
                }
            });
        }
    });
}



function KhoaTaiKhoan(maChuSan) {
    Swal.fire({
        title: "Bạn có chắc chắn muốn khóa tài khoản?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Khóa",
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/Admin/QuanLyTaiKhoan/KhoaTaiKhoan", // <- gọi đúng route của controller
                type: "POST",
                data: { maChuSan: maChuSan },
                success: function (response) {
                    if (response.success) {
                        Swal.fire("Thành công!", response.message, "success");
                        loadChuSanData(); // Tải lại danh sách chủ sân
                    } else {
                        toastr.error(response.message);
                    }
                },
                error: function () {
                    toastr.error("Có lỗi xảy ra khi khóa tài khoản.");
                }
            });
        }
    });
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


function TimKiemTaiKhoan() {
    let keyword = $("#searchTaiKhoan").val().toLowerCase();

    $("#chuSanTableBody tr").each(function () {
        let rowText = $(this).text().toLowerCase(); // Lấy toàn bộ nội dung hàng
        if (rowText.includes(keyword)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

$('#searchTaiKhoan').keyup(function () {
    TimKiemTaiKhoan();
});


// Gọi hàm khi trang vừa load
$(document).ready(function () {
    loadChuSanData();
});
