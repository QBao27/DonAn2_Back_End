using Football_3TL.Data;
using Football_3TL.Services.Email;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.Customer.Controllers
{
    [Area("Customer")]
    public class MailTestController : Controller
    {
        private readonly IEmailService _emailService;

        private readonly Football3tlContext _db;

        public MailTestController(IEmailService emailService, Football3tlContext db)
        {
            _emailService = emailService;

            _db = db;
        }

        public IActionResult Index() => View();

        [HttpPost]
        public async Task<IActionResult> ForgotPassword_CheckEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                return Json(new { success = false, message = "Email không được để trống." });

            var chuSan = _db.ChuSans.FirstOrDefault(x => x.Email == email);
            if (chuSan == null)
                return Json(new { success = false, message = "Email này không tồn tại trong hệ thống." });

            var taiKhoan = _db.TaiKhoans.FirstOrDefault(x => x.MaChuSan == chuSan.MaChuSan);
            if (taiKhoan == null)
                return Json(new { success = false, message = "Không tìm thấy tài khoản liên kết với email này." });


            var otp = new Random().Next(100000, 999999).ToString();
            var taiKhoanOtp = new TaiKhoanOtp
            {
                MaTaiKhoan = taiKhoan.MaTaiKhoan,
                Otp = otp,
                Hsd = DateTime.Now.AddMinutes(2)
            };

            _db.TaiKhoanOtps.Add(taiKhoanOtp);
            await _db.SaveChangesAsync();

            HttpContext.Session.SetInt32("MaTaiKhoan_QMK", taiKhoan.MaTaiKhoan);


            await _emailService.SendEmailAsync(email, "Mã OTP đặt lại mật khẩu", $"Mã OTP của bạn là: <b>{otp}</b>");

            return Json(new { success = true, message = "Mã OTP đã được gửi đến email của bạn." });
        }

        [HttpPost]
        public IActionResult VerifyOtp(string otp)
        {
            if (string.IsNullOrEmpty(otp))
            {
                return Json(new { success = false, message = "OTP không được để trống." });
            }

            var taiKhoanOtp = _db.TaiKhoanOtps
                .OrderByDescending(x => x.Hsd)
                .FirstOrDefault(x => x.Otp == otp);

            if (taiKhoanOtp == null)
            {
                return Json(new { success = false, message = "Mã OTP không hợp lệ." });
            }

            if (DateTime.Now > taiKhoanOtp.Hsd)
            {
                return Json(new { success = false, message = "Mã OTP đã hết hạn. Vui lòng yêu cầu lại." });
            }

            return Json(new { success = true, message = "OTP hợp lệ. Vui lòng đổi mật khẩu mới." });
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword(string newPassword)
        {
            if (string.IsNullOrEmpty(newPassword))
                return Json(new { success = false, message = "Mật khẩu không được để trống." });


            var maTaiKhoan = HttpContext.Session.GetInt32("MaTaiKhoan_QMK");
            if (maTaiKhoan == null)
                return Json(new { success = false, message = "Session đã hết hạn. Vui lòng thử lại từ đầu." });


            var taiKhoan = await _db.TaiKhoans.FindAsync(maTaiKhoan);
            if (taiKhoan == null)
                return Json(new { success = false, message = "Không tìm thấy tài khoản." });


            taiKhoan.MatKhau = HashPassword(newPassword);

            await _db.SaveChangesAsync();


            HttpContext.Session.Remove("MaTaiKhoan_QMK");

            return Json(new { success = true, message = "Đổi mật khẩu thành công!" });
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }


    }
}
