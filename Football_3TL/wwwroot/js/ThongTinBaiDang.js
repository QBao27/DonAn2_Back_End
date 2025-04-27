
//Hàm preview hình ảnh
function previewImage(event, imgId) {
    let imgElement = document.getElementById(imgId);
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            imgElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

$(document).ready(function () {
    showThongTinBaiDang();
    getImages();
})

//Hàm hiển thị hình ảnh 
function getImages() {
    $.ajax({
        url: "/ChuSanBong/DangThongTinSan/GetHinhAnh",
        type: "GET",
        success: function (response) {
            if (response.success) {
                let data = response.data;
                data.forEach(img => {
                    // Set src cho từng thẻ <img>
                    $(`#${img.imgIndex}`).attr('src', img.hinhAnh);
                });
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Có lỗi xảy ra khi lấy dữ liệu sân.");
            console.error("XHR:", xhr);
            console.error("Status:", status);
            console.error("Error:", error);
        }
    });
}

//hàm update hình ảnh
function updateImages() {
    var formData = new FormData();

    // Duyệt 4 ô file, nếu có file mới thì append 2 trường:
    //   - "files"  : chính là file
    //   - "orders" : thứ tự (i)
    for (var i = 1; i <= 4; i++) {
        var input = document.getElementById("file" + i);
        if (input.files && input.files.length > 0) {
            formData.append("files", input.files[0]);
            formData.append("orders", i);
        }
    }

    // Gửi AJAX lên server
    $.ajax({
        url: "/ChuSanBong/DangThongTinSan/UpdateImages",  // endpoint xử lý files + orders
        type: 'POST',
        data: formData,
        processData: false,   // không để jQuery tự chuyển data thành query string
        contentType: false,   // để browser tự set boundary multipart/form-data
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    // Xóa tất cả file inputs
                    for (var i = 1; i <= 4; i++) {
                        $("#file" + i).val("");
                    }
                });
            }
            else {
                toastr.error(response.message, "", {
                    timeOut: 2000
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi hệ thống",
                text: "Không thể kết nối với máy chủ, vui lòng thử lại sau!",
                confirmButtonText: "OK",
                timer: 2000,
                customClass: {
                    popup: 'custom-swal'
                }
            });
        }
    });
}

//hàm update thời gian mở cửa và đóng cửa
function updateTime() {
    let gioMoCua = parseInt($('#openingTime').val());
    let gioDongCua = parseInt($('#closingTime').val());

    if (gioDongCua <= gioMoCua) {
        toastr.warning("Thời gian không hợp lệ!", "", {
            timeOut: 2000 // Giới hạn thời gian hiển thị là 2 giây
        });
        return;
    }

    // Gửi AJAX với dữ liệu JSON
    $.ajax({
        url: "/ChuSanBong/DangThongTinSan/updateThoiGianMoCua",
        type: "POST", // Đảm bảo phương thức POST
        dataType: 'json',
        contentType: 'application/json', // Đảm bảo gửi dữ liệu dưới dạng JSON
        data: JSON.stringify({
            gioMoCua: gioMoCua, // Dữ liệu gửi đi
            gioDongCua: gioDongCua
        }),
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                });
                // Ẩn modal
                $('#editTimeModal').modal('hide');
                showThongTinBaiDang();
            } else {
                toastr.error(response.message, "", {
                    timeOut: 2000
                });
            }
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Lỗi hệ thống",
                text: "Không thể kết nối với máy chủ, vui lòng thử lại sau!",
                confirmButtonText: "OK",
                timer: 2000,
                customClass: {
                    popup: 'custom-swal'
                }
            });
        }
    });
}

//hiển thị thông tin
function showThongTinBaiDang() {
    $.ajax({
        url: "/ChuSanBong/DangThongTinSan/GetThongTinBaiDangSan", // Đổi 'TenController' thành tên controller thật sự
        type: 'GET',
        success: function (response) {
            if (response.success) {
                let data = response.data;
                $("#gioMoCuaBD").text(data.gioMoCua);
                $("#gioDongCuaBD").text(data.gioDongCua);
                $("#soLuongSanBD").text(data.soLuongSan);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Có lỗi xảy ra khi lấy dữ liệu sân.");
            console.error(error);
        }
    });
}


