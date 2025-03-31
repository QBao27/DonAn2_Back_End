function uploadImages() {
    let formData = new FormData();

    let fileInputs = document.querySelectorAll(".file-upload");
    fileInputs.forEach(input => {
        if (input.files.length > 0) {
            formData.append("files", input.files[0]); // "files" phải khớp với tên tham số trong API
        }
    });

    fetch('/ChuSanBong/DangThongTinSan/UploadImages', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json()) // Chuyển response thành JSON
        .then(data => {
            location.reload();
        })
        .catch(error => {
            console.error("Lỗi:", error);
            alert("Lỗi trong quá trình tải ảnh lên.");
        });

}

document.getElementById("BtnDongY").addEventListener("click", uploadImages);


function loadImages(maChuSan) {
    console.log("🔍 Gửi request với MaChuSan:", maChuSan); // Debug

    fetch(`/ChuSanBong/DangThongTinSan/GetImages?maChuSan=${maChuSan}`)
        .then(response => response.json())
        .then(data => {
            console.log("📥 Dữ liệu nhận được từ server:", data);

            if (!Array.isArray(data)) {
                console.error("❌ Lỗi: Server không trả về danh sách ảnh.", data);
                return;
            }

            data.forEach(image => {
                let imgElement = document.getElementById(image.imgId);
                if (imgElement) {
                    imgElement.src = image.hinhAnh.replace("~", "");
                    console.log(`✅ Cập nhật ảnh: ${image.imgId} -> ${imgElement.src}`);
                } else {
                    console.warn(`⚠️ Không tìm thấy phần tử có ID: ${image.imgId}`);
                }
            });
        })
        .catch(error => console.error("❌ Lỗi khi tải ảnh:", error));
}

// Gọi khi trang tải xong
document.addEventListener("DOMContentLoaded", function () {
    loadImages(1); // Kiểm tra lại MaChuSan thực tế
});




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

