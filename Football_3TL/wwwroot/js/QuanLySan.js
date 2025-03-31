
let sanBongList = [];  // Lưu danh sách sân bóng
let currentPage = 1;
let itemsPerPage = 8; // Số lượng sân hiển thị mỗi trang

function LoadSanBong() {
    $.ajax({
        url: '/ChuSanBong/QuanLySan/GetSanBong',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.error) {
                alert(data.error);
                return;
            }

            sanBongList = data; // Lưu toàn bộ danh sách sân
            renderTable();
            renderPagination();
        },
        error: function () {
            alert("Lỗi khi tải dữ liệu sân bóng.");
        }
    });
}

// Hàm hiển thị danh sách sân theo trang
function renderTable() {
    let tableBody = $("#sanBongTable");
    tableBody.empty();

    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let displayedItems = sanBongList.slice(startIndex, endIndex);

    $.each(displayedItems, function (index, san) {
        let row = `<tr>
                        <th scope="row">${startIndex + index + 1}</th>
                        <td><input type="hidden" class="maSan" value="${san.maSan}">${san.tenSan}</td>
                        <td>${san.loaiSan}</td>
                        <td>${san.gia} VND/giờ</td>
                        <td class="d-flex justify-content-end">
                            <button type="button" class="btn btn-warning me-2" data-bs-toggle="modal"
                                    data-bs-target="#sua" data-bs-dismiss="modal" onclick="HienThiModalSua(${san.maSan})">
                                Sửa
                            </button>
                            <button type="button" class="btn btn-danger" onclick="HienThiThongBaoXoa(${san.maSan})">Xóa</button>
                        </td>
                    </tr>`;
        tableBody.append(row);
    });
}

// Hàm tạo phân trang
function renderPagination() {
    let totalPages = Math.ceil(sanBongList.length / itemsPerPage);
    let html = "";

    if (totalPages > 1) {
        html += `<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">«</a>
                 </li>`;

        for (let i = 1; i <= totalPages; i++) {
            html += `<li class="page-item ${i === currentPage ? "active" : ""}">
                        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                     </li>`;
        }

        html += `<li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">»</a>
                 </li>`;
    }

    $("#pagination").html(html);
}

// Hàm thay đổi trang
function changePage(page) {
    if (page >= 1 && page <= Math.ceil(sanBongList.length / itemsPerPage)) {
        currentPage = page;
        renderTable();
        renderPagination();
    }
}



function KiemTraLoi() {
    let isValid = true;

    // Lấy phần tử
    let tenSanElement = document.getElementById("tenSan");
    let giaElement = document.getElementById("gia");
    let loaiSanElement = document.getElementById("LoaiSan");

    // Kiểm tra xem phần tử có tồn tại không
    if (!tenSanElement || !giaElement || !loaiSanElement) {
        console.error("Không tìm thấy phần tử input.");
        return;
    }

    // Lấy giá trị từ input
    let tenSan = tenSanElement.value;
    let gia = giaElement.value;
    let loaiSan = loaiSanElement.value;

    let errortenSan = document.getElementById("errortenSan");
    let errorGia = document.getElementById("errorGia");
    let errorLoaiSan = document.getElementById("ErrorLoaiSan");

    // Xóa thông báo lỗi trước khi kiểm tra
    errortenSan.textContent = "";
    errorGia.textContent = "";
    errorLoaiSan.textContent = "";

    // Kiểm tra tên sân
    if (!tenSan || tenSan.trim() === "") {
        errortenSan.textContent = "Vui lòng nhập tên sân.";
        isValid = false;
    }

    // Kiểm tra giá sân
    if (!gia || gia.trim() === "" || isNaN(gia) || gia <= 0) {
        errorGia.textContent = "Vui lòng nhập giá hợp lệ.";
        isValid = false;
    }

    // Kiểm tra loại sân
    if (!loaiSan || loaiSan === "") {
        errorLoaiSan.textContent = "Vui lòng chọn loại sân.";
        isValid = false;
    }

    // Nếu hợp lệ, gọi hàm ThemSanBong()
    if (isValid) {
        ThemSanBong(tenSan, gia, loaiSan);
    } else {
        toastr.warning("Bạn chưa nhập thông tin!", "", {
            timeOut: 1000 // Giới hạn thời gian hiển thị là 1 giây
        });
    }
}


function ThemSanBong(tenSan, gia, loaiSan) {
    $.ajax({
        url: '/ChuSanBong/QuanLySan/ThemSanBong',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            TenSan: tenSan.trim(),
            Gia: parseFloat(gia),
            LoaiSan: loaiSan
        }),
        success: function (response) {
            if (response.success) {
                showSweetAlert(response.message);
                // Ẩn modal sau khi thêm thành công
                $("#them").modal("hide");
                LoadSanBong();
                $("#tenSan").val("");
                $("#gia").val("");
                $("#LoaiSan").val("");
            } else {
                toastr.error(response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi AJAX:", status, error);
            console.error("Phản hồi từ server:", xhr.responseText);
            toastr.error("Lỗi khi thêm sân. Chi tiết: " + xhr.responseText);
        }
    });
}

function KiemTraLoiSua() {
    let isValid = true;

    // Lấy giá trị từ các input
    let tenSan = document.getElementById("EdittenSan").value.trim();
    let gia = document.getElementById("Editgia").value.trim();
    let loaiSan = document.getElementById("EditloaiSan").value;
    let maSan = document.getElementById("EditmaSan").value; // Lấy mã sân

    let errortenSan = document.getElementById("EditerrorTenSan");
    let errorGia = document.getElementById("EditerrorGia");
    let errorLoaiSan = document.getElementById("EditErrorLoaiSan");

    // Xóa thông báo lỗi trước khi kiểm tra
    errortenSan.textContent = "";
    errorGia.textContent = "";
    errorLoaiSan.textContent = "";

    // Kiểm tra tên sân
    if (tenSan === "") {
        errortenSan.textContent = "Vui lòng nhập tên sân.";
        isValid = false;
    }

    // Kiểm tra giá sân
    if (gia === "" || isNaN(gia) || parseFloat(gia) <= 0) {
        errorGia.textContent = "Vui lòng nhập giá hợp lệ.";
        isValid = false;
    }

    // Kiểm tra loại sân
    if (loaiSan === "") {
        errorLoaiSan.textContent = "Vui lòng chọn loại sân.";
        isValid = false;
    }

    // Nếu hợp lệ thì gọi hàm cập nhật sân bóng
    if (isValid) {
        SuaSanBong(maSan, tenSan, gia, loaiSan);
    } else {
        toastr.warning("Vui lòng kiểm tra lại thông tin!", "", {
            timeOut: 1000 // Giới hạn thời gian hiển thị là 1 giây
        });
    }
}


function SuaSanBong(maSan, tenSan, gia, loaiSan) {
    $.ajax({
        url: '/ChuSanBong/QuanLySan/SuaSanBong',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            MaSan: maSan,
            TenSan: tenSan.trim(),
            Gia: parseFloat(gia),
            LoaiSan: loaiSan
        }),
        success: function (response) {
            if (response.success) {
                showSweetAlert(response.message);

                // Ẩn modal sau khi cập nhật thành công
                $("#sua").modal("hide");

                // Gọi lại LoadSanBong để cập nhật danh sách
                LoadSanBong();

                // Xóa dữ liệu sau khi nhập thành công
                tenSan.value = "";
                gia.value = "";
                loaiSan.value = "";
            } else {
                toastr.error(response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi AJAX:", status, error);
            console.error("Phản hồi từ server:", xhr.responseText);
            toastr.error("Lỗi khi cập nhật sân. Chi tiết: " + xhr.responseText);
        }
    });
}

function HienThiModalSua(maSan) {
    $.ajax({
        url: `/ChuSanBong/QuanLySan/ChiTietSanBong/${maSan}`,
        type: 'GET',
        dataType: 'json',
        success: function (san) {
            if (san) {
                // Đổ dữ liệu vào modal
                $("#EditmaSan").val(san.maSan);  // Ẩn nhưng lưu mã sân
                $("#EdittenSan").val(san.tenSan);
                $("#Editgia").val(san.gia);
                $("#EditloaiSan").val(san.loaiSan);

                // Hiển thị modal
                $("#sua").modal("show");
            } else {
                toastr.error("Không tìm thấy sân bóng!");
            }
        },
        error: function () {
            toastr.error("Lỗi khi lấy thông tin sân bóng.");
        }
    });
}


function HienThiThongBaoXoa(maSan) {
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
            $.ajax({
                url: "/ChuSanBong/QuanLySan/XoaSanBong",
                type: "POST",
                data: { maSan: maSan },
                success: function (response) {
                    if (response.success) {
                        Swal.fire("Xóa thành công!", response.message, "success");
                        LoadSanBong(); // Tải lại danh sách sân bóng
                    } else {
                        toastr.error(response.message);
                    }
                },
                error: function () {
                    toastr.error("Lỗi khi xóa sân bóng!");
                }
            });
        }
    });
}


function TimKiemSan() {
    let keyword = $("#timKiemSan").val().toLowerCase();

    $("#sanBongTable tr").each(function () {
        let rowText = $(this).text().toLowerCase(); // Lấy toàn bộ nội dung hàng
        if (rowText.includes(keyword)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}



$(document).ready(function () {
    LoadSanBong();
});
