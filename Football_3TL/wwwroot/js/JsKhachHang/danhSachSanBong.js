// 1. Khai báo biến toàn cục
let sanBongs = [];          // đây sẽ chứa dữ liệu từ API
let danhSachSanSearch = [];  //đây sẽ lưu dữ liệu khi load lần đầu thành công
const itemsPerPage = 8;     // số sân mỗi trang
let currentPage = 1;        // trang hiện tại

// 2. Hàm gọi API và khởi tạo hiển thị
function fetchDanhSachSan() {
    $.ajax({
        url: "/Customer/Home/getDanhSachSan",
        type: "GET",
        success: function (response) {
            if (response.success) {
                sanBongs = response.data;    // gán dữ liệu từ API
                danhSachSanSearch = response.data.slice(); // lưu bản gốc
                const $sel = $('#danhSachTenSan');
                $sel.empty();
                $sel.append('<option value="">-- Chọn sân --</option>');
                response.data.forEach(san => {
                    $sel.append(`
                        <option value="${san.tenSanBong}">
                            ${san.tenSanBong}
                        </option>
                    `);
                });

                $('#tongSoSanBongDa').text(response.tongSan)
                currentPage = 1;             // reset về trang 1
                displaySanBong();            // vẽ danh sách trang đầu
                updatePagination();          // vẽ thanh phân trang
            } else {
                toastr.error("Lấy danh sách sân thất bại!");
            }
        },
        error: function () {
            toastr.error("Có lỗi khi kết nối API!");
        }
    });
}




// 3. Hàm hiển thị sân theo trang
function displaySanBong(page = currentPage) {
    const $sanList = $('#listSanBong');
    $sanList.empty();

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const paginatedItems = sanBongs.slice(start, end);

    paginatedItems.forEach(san => {

        const soSao = san.soSaoTB % 1 === 0 ? san.soSaoTB : san.soSaoTB.toFixed(1);
        const soDanhGia = san.soDanhGia || 0;

        $sanList.append(`
            <div class="col-xl-3 col-lg-4 col-md-6 pe-0 pb-3">
                <div class="card p-2 border-0 shadow-lg h-100 card-hover"
                    style="border-radius: 10px !important;">
                    <img src="${san.anhBaiDang || '/Img/anhSanBongDefault.png'}" 
                        class="card-img-top img-hover" 
                        style="border-radius: 10px !important; width: 100%; height: 260px; object-fit: cover;"
                        alt="Ảnh sân bóng">
                    <div class="card-body px-0 pb-1 pt-2">
                        <span class="card-title fw-bold mb-0 text-truncate d-inline-block" style="font-size: large; width: 95%;">${san.tenSanBong}</span>
                        <div class="card-text m-0"> 
                            <div class="d-flex">
                                <span class="me-1 flex-shrink-0">Khu vực: </span>
                                <span class="text-truncate flex-grow-1" style="max-width: 95%;"> ${san.huyen} - ${san.tinh}</span>
                            </div>
                            <div class="mt-1 mb-1">
                                <span class="me-1">Số sân:</span> <span>${san.soSanBong}</span>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <span>Số đánh giá:</span>
                                <span class="me-1">${soDanhGia}</span>
                            </div>
                            <div>
                                <span>${soSao}</span>/5
                                <img src="/Img/star-svgrepo-com.svg" alt="" style="width: 15px;height: 15px;" class="ms-1">
                            </div>
                        </div>
                        <a href="/Customer/DatSan/Index?maChuSan=${san.maChuSan}" class="btn btn-primary w-100 mt-3"
                            style="border-radius: 10px !important;background-color: #0e2238; height:43px;">Đặt
                            nhanh kẻo muộn</a>
                    </div>
                </div>
            </div>
        `);
    });
}


// 4. Hàm chuyển trang
function goToPage(page) {
    const totalPages = Math.ceil(sanBongs.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    displaySanBong();
    updatePagination();
}

// 5. Hàm vẽ thanh phân trang
function updatePagination() {
    const $pag = $("#pagination");
    $pag.empty();

    const totalPages = Math.ceil(sanBongs.length / itemsPerPage);
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    if (currentPage > 1) {
        $pag.append(`<li class="page-item">
      <a class="page-link" href="#" onclick="goToPage(1)">«</a>
    </li>`);
    }

    for (let i = startPage; i <= endPage; i++) {
        $pag.append(`<li class="page-item ${i === currentPage ? 'active' : ''}">
      <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
    </li>`);
    }

    if (currentPage < totalPages) {
        $pag.append(`<li class="page-item">
      <a class="page-link" href="#" onclick="goToPage(${totalPages})">»</a>
    </li>`);
    }
}


// 6. Khi DOM ready thì gọi API
$(document).ready(function () {
    fetchDanhSachSan();

    $('#btnResetTimKiem').on('click', function (e) {
        e.preventDefault();
        $('#diaChiTinhTimKiem, #diaChiHuyenTimKiem, #danhSachTenSan').val('');
        sanBongs = danhSachSanSearch.slice();
        currentPage = 1;
        displaySanBong();
        updatePagination();
    });

    // Tìm kiếm (filter) theo Tỉnh / Huyện / Loại
    $('#btnTimKiemDanhSachSan').on('click', function (e) { 
        e.preventDefault();  // ngăn reload trang

        // 1) Lấy VALUE (rỗng nếu chưa chọn)
        const tinhVal = $('#diaChiTinhTimKiem').val().trim();
        const huyenVal = $('#diaChiHuyenTimKiem').val().trim();
        const tenVal = $('#danhSachTenSan').val().trim();

        // Lấy text hiển thị
        const tinh = $('#diaChiTinhTimKiem option:selected').text().trim();
        const huyen = $('#diaChiHuyenTimKiem option:selected').text().trim();

        if (!tinhVal && !huyenVal) {
            sanBongs = danhSachSanSearch.slice();
        }
        else if (tinhVal && !huyenVal) {
            sanBongs = danhSachSanSearch.filter(san => {
                return (!tinh || san.tinh === tinh)
            });
        }
        else {
            sanBongs = danhSachSanSearch.filter(san => {
                return (!tinh || san.tinh === tinh) &&
                    (!huyen || san.huyen === huyen)
            });
        }

        if (tenVal != '') {
            sanBongs = danhSachSanSearch.filter(san => {
                return (!tenVal || san.tenSanBong === tenVal) 
            });
        }
        currentPage = 1;
        displaySanBong();
        updatePagination();
    });

    //tìm kiếm sân bóng trên thanh header 
    $('#timKiemOnHeader').on('input', function () {
        const keyword = $(this).val().trim().toLowerCase();

        sanBongs = danhSachSanSearch.filter(san => {
            const okKeyword = !keyword || san.tenSanBong.toLowerCase().includes(keyword);
            return okKeyword;
        });

        currentPage = 1;
        displaySanBong();
        updatePagination();
    });
});
