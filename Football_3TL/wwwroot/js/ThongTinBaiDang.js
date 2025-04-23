//function uploadImages() {
//    let formData = new FormData();

//    let fileInputs = document.querySelectorAll(".file-upload");
//    fileInputs.forEach(input => {
//        if (input.files.length > 0) {
//            formData.append("files", input.files[0]); // "files" phải khớp với tên tham số trong API
//        }
//    });

//    fetch('/ChuSanBong/DangThongTinSan/UploadImages', {
//        method: 'POST',
//        body: formData
//    })
//        .then(response => response.json()) // Chuyển response thành JSON
//        .then(data => {
//            location.reload();
//        })
//        .catch(error => {
//            console.error("Lỗi:", error);
//            alert("Lỗi trong quá trình tải ảnh lên.");
//        });

//}


//function loadImagesFromAPI() {

//    fetch('/ChuSanBong/DangThongTinSan/GetMaChuSan')
//        .then(response => response.json())
//        .then(data => {
//            if (!data.maChuSan) {
//                return;
//            }

//            loadImages(data.maChuSan);
//        })
//        .catch(error => console.error("❌ Lỗi khi lấy MaChuSan:", error));
//}

//// Gọi API khi trang tải xong
//document.addEventListener("DOMContentLoaded", function () {
//    loadImagesFromAPI();
//});


//function loadImages(maChuSan) {
//    console.log("🔍 Gửi request với MaChuSan:", maChuSan);

//    fetch(`/ChuSanBong/DangThongTinSan/GetImages?maChuSan=${maChuSan}`)
//        .then(response => {
//            if (!response.ok) {
//                throw new Error(`HTTP error! Status: ${response.status}`);
//            }
//            return response.json();
//        })
//        .then(data => {
//            console.log("📥 Dữ liệu nhận được từ server:", data);

//            if (!Array.isArray(data)) {
//                console.error("❌ Lỗi: Server không trả về danh sách ảnh.", data);
//                return;
//            }

//            data.forEach(image => {
//                console.log("📝 Dữ liệu ảnh:", image);

//                let imgElement = document.getElementById(image.imgId);
//                let index = image.Index !== undefined ? image.Index : image.imgId.replace("img", "");
//                let maAnhElement = document.getElementById(`maAnh${index}`);

//                // Cập nhật ảnh vào thẻ <img> tại vị trí thẻ tương ứng
//                if (imgElement) {
//                    imgElement.src = image.hinhAnh.replace("~", "");
//                    console.log(`✅ Cập nhật ảnh ${image.maAnh}: ${image.imgId} -> ${imgElement.src}`);
//                } else {
//                    console.warn(`⚠️ Không tìm thấy phần tử có ID: ${image.imgId}`);
//                }

//                // Cập nhật maAnh vào thẻ <span> nhưng không thay đổi vị trí của thẻ đó
//                if (maAnhElement) {
//                    maAnhElement.textContent = image.maAnh;
//                    maAnhElement.style.display = "none";
//                    console.log(`✅ Cập nhật maAnh: ${image.maAnh} vào ${maAnhElement.id}`);
//                } else {
//                    console.warn(`⚠️ Không tìm thấy phần tử có ID: maAnh${index}`);
//                }
//            });
//        })
//        .catch(error => console.error("❌ Lỗi khi tải ảnh:", error));
//}





//function updateImage() {
//    // Lấy ID ảnh mà bạn muốn cập nhật
//    let selectedImageId = document.querySelector('input[type="file"]:checked').id.replace('file', 'img'); // ID của ảnh
//    let spanId = `maAnh${selectedImageId.replace('img', '')}`; // Tạo ID tương ứng với span

//    let maAnh = document.getElementById(spanId).textContent; // Lấy maAnh từ span
//    let fileInput = document.getElementById(`file${selectedImageId.replace('img', '')}`);

//    // Chắc chắn rằng bạn đã chọn một file
//    if (fileInput.files.length > 0) {
//        let formData = new FormData();
//        formData.append("file", fileInput.files[0]); // Thêm ảnh mới vào formData
//        formData.append("maAnh", maAnh); // Thêm maAnh vào formData

//        // Gửi yêu cầu POST để cập nhật ảnh
//        fetch('/ChuSanBong/DangThongTinSan/UploadImages', {
//            method: 'POST',
//            body: formData
//        })
//            .then(response => response.json())
//            .then(data => {
//                console.log('✅ Ảnh đã được upload:', data);
//                location.reload(); // Tải lại trang sau khi cập nhật
//            })
//            .catch(error => {
//                console.error('❌ Lỗi khi upload ảnh:', error);
//            });
//    }
//}




//function previewImage(event, imgId) {
//    let imgElement = document.getElementById(imgId);
//    let file = event.target.files[0];

//    if (file) {
//        let reader = new FileReader();
//        reader.onload = function (e) {
//            imgElement.src = e.target.result; // Hiển thị ảnh mới trước khi upload
//        };
//        reader.readAsDataURL(file);
//    }
//}


    //hàm update thời gian mở cửa và đóng cửa
//function updateTime() {
//    let gioMoCua = parseInt($('#openingTime').val());
//    let gioDongCua = parseInt($('#closingTime').val());

//    if (gioDongCua <= gioMoCua) {
//        toastr.warning("Thời gian không hợp lệ!", "", {
//            timeOut: 2000 // Giới hạn thời gian hiển thị là 2 giây
//        });
//        return;
//    }

//    // Gửi AJAX với dữ liệu JSON
//    $.ajax({
//        url: "/ChuSanBong/DangThongTinSan/updateThoiGianMoCua",
//        type: "POST", // Đảm bảo phương thức POST
//        dataType: 'json',
//        contentType: 'application/json', // Đảm bảo gửi dữ liệu dưới dạng JSON
//        data: JSON.stringify({
//            gioMoCua: gioMoCua, // Dữ liệu gửi đi
//            gioDongCua: gioDongCua
//        }),
//        success: function (response) {
//            if (response.success) {
//                Swal.fire({
//                    icon: "success",
//                    title: "Thành công",
//                    text: response.message,
//                    timer: 2000,
//                    showConfirmButton: false
//                });
//                // Ẩn modal
//                $('#editTimeModal').modal('hide');
//                showThongTinBaiDang();
//            } else {
//                toastr.error(response.message, "", {
//                    timeOut: 2000
//                });
//            }
//        },
//        error: function (xhr) {
//            Swal.fire({
//                icon: "error",
//                title: "Lỗi hệ thống",
//                text: "Không thể kết nối với máy chủ, vui lòng thử lại sau!",
//                confirmButtonText: "OK",
//                timer: 2000,
//                customClass: {
//                    popup: 'custom-swal'
//                }
//            });
//        }
//    });
//}

////hiển thị thông tin
//function showThongTinBaiDang() {
//    $.ajax({
//        url: "/ChuSanBong/DangThongTinSan/GetThongTinBaiDangSan", // Đổi 'TenController' thành tên controller thật sự
//        type: 'GET',
//        success: function (response) {
//            if (response.success) {
//                let data = response.data;
//                $("#gioMoCuaBD").text(data.gioMoCua);
//                $("#gioDongCuaBD").text(data.gioDongCua);
//                $("#soLuongSanBD").text(data.soLuongSan);
//            }
//        },
//        error: function (xhr, status, error) {
//            toastr.error("Có lỗi xảy ra khi lấy dữ liệu sân.");
//            console.error(error);
//        }
//    });
//}

//$(document).ready(function () {
//    showThongTinBaiDang();
//})

