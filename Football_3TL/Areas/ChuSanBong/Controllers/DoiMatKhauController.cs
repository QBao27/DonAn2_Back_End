using Football_3TL.Areas.ChuSanBong.Models;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    public class DoiMatKhauController : Controller
    {
        //thay thế cho database
        private readonly Football3tlContext _db;
        //tạo logger để ghi log để dễ kiểm tra lỗi
        private readonly ILogger<DoiMatKhauController> _log;

        public DoiMatKhauController(Football3tlContext db, ILogger<DoiMatKhauController> log)
        {
            _db = db;
            _log = log;
        }

        [HttpPost]
        public async Task<IActionResult> DoiMatKhauChuSan([FromBody] ModelDoiMatKhau model)
        {
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");
            if (!maChuSan.HasValue)
            {
                _log.LogError("maChuSan is null. Session might not be set.");
                return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
            }

            try
            {
                // 1. Kiểm tra dữ liệu đầu vào (model)
                if (model == null)
                {
                    _log.LogError("Thông tin không hợp lệ: ModelDoiMatKhau is null.");
                    return Json(new { success = false, message = "Thông tin không hợp lệ!" });
                }

                // 2. Kiểm tra các trường mật khẩu có bị null hoặc rỗng không
                if (string.IsNullOrEmpty(model.MatKhauHienTai) || string.IsNullOrEmpty(model.MatKhauMoi) || string.IsNullOrEmpty(model.MatKhauMoi1))
                {
                    _log.LogError("Thông tin không hợp lệ: Một hoặc nhiều trường mật khẩu rỗng.");
                    return Json(new { success = false, message = "Vui lòng nhập đầy đủ các trường mật khẩu!" });
                }

                // 3. Kiểm tra độ dài mật khẩu
                if (model.MatKhauHienTai.Length < 6 || model.MatKhauMoi.Length < 6 || model.MatKhauMoi1.Length < 6)
                {
                    _log.LogError($"Mật khẩu phải có ít nhất 6 ký tự. MatKhauHienTai: {model.MatKhauHienTai.Length}, MatKhauMoi: {model.MatKhauMoi.Length}, MatKhauMoi1: {model.MatKhauMoi1.Length}");
                    return Json(new { success = false, message = "Mật khẩu phải có ít nhất 6 ký tự!" });
                }

                // 4. Kiểm tra mật khẩu mới và mật khẩu hiện tại có trùng nhau không
                if (model.MatKhauMoi == model.MatKhauHienTai)
                {
                    _log.LogError("Mật khẩu mới trùng với mật khẩu hiện tại. User ID: {UserId}", maChuSan.Value);
                    return Json(new { success = false, message = "Mật khẩu mới không được trùng mật khẩu hiện tại!" });
                }

                // 5. Kiểm tra mật khẩu mới nhập lại có khớp không
                if (model.MatKhauMoi != model.MatKhauMoi1)
                {
                    _log.LogError("Mật khẩu mới nhập lại không khớp. User ID: {UserId}", maChuSan.Value);
                    return Json(new { success = false, message = "Mật khẩu mới nhập lại không khớp!" });
                }

                // --- Bắt đầu logic xử lý nghiệp vụ ---

                // Lấy thông tin chủ sân từ cơ sở dữ liệu
                // Giả sử bạn có một dịch vụ hoặc DbContext để truy cập dữ liệu
                // Lấy tài khoản qua chuSanId
                var taiKhoan = await _db.TaiKhoans
                                       .FirstOrDefaultAsync(t => t.MaChuSan == maChuSan.Value);

                if (taiKhoan == null)
                {
                    _log.LogError("Không tìm thấy tài khoản với mã chủ sân: {UserId}", maChuSan.Value);
                    return Json(new { success = false, message = "Không tìm thấy thông tin tài khoản!" });
                }

                // Xác thực mật khẩu hiện tại
                // Sử dụng thư viện băm mật khẩu (ví dụ: BCrypt.Net) để so sánh
                if (!BCrypt.Net.BCrypt.Verify(model.MatKhauHienTai, taiKhoan.MatKhau)) // Giả sử chuSan.MatKhauHash là mật khẩu đã băm
                {
                    _log.LogWarning("Người dùng {UserId} nhập sai mật khẩu hiện tại.", maChuSan.Value);
                    return Json(new { success = false, message = "Mật khẩu hiện tại không đúng!" });
                }

                // Băm mật khẩu mới
                string matKhauMoiHash = BCrypt.Net.BCrypt.HashPassword(model.MatKhauMoi);

                // Cập nhật mật khẩu mới vào cơ sở dữ liệu
                taiKhoan.MatKhau = matKhauMoiHash; // Cập nhật trường mật khẩu đã băm
                await _db.SaveChangesAsync(); // Gọi phương thức để lưu thay đổi vào DB

                _log.LogInformation("Người dùng {UserId} đã đổi mật khẩu thành công.", maChuSan.Value);
                return Json(new { success = true, message = "Đổi mật khẩu thành công!" });
            }
            catch (Exception ex)
            {
                // Ghi log lỗi chi tiết hơn
                _log.LogError(ex, "Lỗi khi đổi mật khẩu cho chủ sân có ID: {UserId}", maChuSan.Value);
                return Json(new { success = false, message = "Đã xảy ra lỗi trong quá trình đổi mật khẩu. Vui lòng thử lại sau." });
            }
        }


    } 

}
