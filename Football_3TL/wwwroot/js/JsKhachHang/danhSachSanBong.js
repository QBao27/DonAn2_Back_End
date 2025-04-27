// 1. Khai báo biến toàn cục
let sanBongs = [];          // đây sẽ chứa dữ liệu từ API
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

    // Tính chỉ số bắt đầu và kết thúc
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // Lấy mảng con phù hợp
    const paginatedItems = sanBongs.slice(start, end);

    // Render ra HTML
    paginatedItems.forEach(san => {
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
                                   <div>
                                    <span class="me-1">Sân trống:</span>
                                    <a class="btn btn-outline-primary btn-sm mx-2" style="border-radius: 10px;"><span>17 : 30</span></a> 
                                    <a class="btn btn-sm btn-outline-primary me-2" style="border-radius: 10px;"style="border-radius: 10px;"><span>19 : 00</span></a>
                                    <button class="btn btn-outline-primary btn-sm" style="border-radius: 10px;"><span>21 : 30</span></button>
                                    </div>
                                    <div class="row mt-1 fw-medium">
                                      <div class="col-6"><i class="fa-solid fa-wifi me-2"></i>Wifi</div>
                                      <div class="col-6"><i class="fa-solid fa-car me-2"></i> Bãi đỗ xe</div>
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
});
