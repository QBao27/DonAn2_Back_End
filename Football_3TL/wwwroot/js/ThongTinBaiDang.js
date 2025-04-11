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


function loadImagesFromAPI() {

    fetch('/ChuSanBong/DangThongTinSan/GetMaChuSan')
        .then(response => response.json())
        .then(data => {
            if (!data.maChuSan) {
                return;
            }

            loadImages(data.maChuSan);
        })
        .catch(error => console.error("❌ Lỗi khi lấy MaChuSan:", error));
}

// Gọi API khi trang tải xong
document.addEventListener("DOMContentLoaded", function () {
    loadImagesFromAPI();
});


function loadImages(maChuSan) {
    console.log("🔍 Gửi request với MaChuSan:", maChuSan);

    fetch(`/ChuSanBong/DangThongTinSan/GetImages?maChuSan=${maChuSan}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("📥 Dữ liệu nhận được từ server:", data);

            if (!Array.isArray(data)) {
                console.error("❌ Lỗi: Server không trả về danh sách ảnh.", data);
                return;
            }

            data.forEach(image => {
                console.log("📝 Dữ liệu ảnh:", image);

                let imgElement = document.getElementById(image.imgId);
                let index = image.Index !== undefined ? image.Index : image.imgId.replace("img", "");
                let maAnhElement = document.getElementById(`maAnh${index}`);

                // Cập nhật ảnh vào thẻ <img> tại vị trí thẻ tương ứng
                if (imgElement) {
                    imgElement.src = image.hinhAnh.replace("~", "");
                    console.log(`✅ Cập nhật ảnh ${image.maAnh}: ${image.imgId} -> ${imgElement.src}`);
                } else {
                    console.warn(`⚠️ Không tìm thấy phần tử có ID: ${image.imgId}`);
                }

                // Cập nhật maAnh vào thẻ <span> nhưng không thay đổi vị trí của thẻ đó
                if (maAnhElement) {
                    maAnhElement.textContent = image.maAnh;
                    maAnhElement.style.display = "none";
                    console.log(`✅ Cập nhật maAnh: ${image.maAnh} vào ${maAnhElement.id}`);
                } else {
                    console.warn(`⚠️ Không tìm thấy phần tử có ID: maAnh${index}`);
                }
            });
        })
        .catch(error => console.error("❌ Lỗi khi tải ảnh:", error));
}





function updateImage() {
    // Lấy ID ảnh mà bạn muốn cập nhật
    let selectedImageId = document.querySelector('input[type="file"]:checked').id.replace('file', 'img'); // ID của ảnh
    let spanId = `maAnh${selectedImageId.replace('img', '')}`; // Tạo ID tương ứng với span

    let maAnh = document.getElementById(spanId).textContent; // Lấy maAnh từ span
    let fileInput = document.getElementById(`file${selectedImageId.replace('img', '')}`);

    // Chắc chắn rằng bạn đã chọn một file
    if (fileInput.files.length > 0) {
        let formData = new FormData();
        formData.append("file", fileInput.files[0]); // Thêm ảnh mới vào formData
        formData.append("maAnh", maAnh); // Thêm maAnh vào formData

        // Gửi yêu cầu POST để cập nhật ảnh
        fetch('/ChuSanBong/DangThongTinSan/UploadImages', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('✅ Ảnh đã được upload:', data);
                location.reload(); // Tải lại trang sau khi cập nhật
            })
            .catch(error => {
                console.error('❌ Lỗi khi upload ảnh:', error);
            });
    }
}




function previewImage(event, imgId) {
    let imgElement = document.getElementById(imgId);
    let file = event.target.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            imgElement.src = e.target.result; // Hiển thị ảnh mới trước khi upload
        };
        reader.readAsDataURL(file);
    }
}

