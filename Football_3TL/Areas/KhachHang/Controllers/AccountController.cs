using Football_3TL.Areas.KhachHang.Models;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;


namespace Football_3TL.Areas.KhachHang.Controllers
{
    [Area("KhachHang")]
    public class AccountController : Controller
    {
        //thay thế cho database
        private readonly Football3tlContext _db;
        //tạo logger để ghi log để dễ kiểm tra lỗi
        private readonly ILogger<AccountController> _log;

        //tạo contructor 
        public AccountController(Football3tlContext db, ILogger<AccountController> log)
        {
            _db = db;
            _log = log; 
        }

        //Hàm đăng ký
        [HttpPost] //dùng formbody khi gửi dữ liệu bằng json or ajax chứ k phải trong from
        public async Task<IActionResult> SignUp([FromBody] modelSignUp model) 
        {
            try
            {
                //kiểm tra dữ liệu 
                if (model == null || !ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
                }

                if (string.IsNullOrEmpty(model.FullName) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Phone) || string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.ConfirmPassword) || string.IsNullOrEmpty(model.Communes) || string.IsNullOrEmpty(model.Province) || string.IsNullOrEmpty(model.PecificAddress))
                {
                    return Json(new { success = false, message = "Dữ liệu bị thiếu!" });
                }

                if (_db.ChuSans.Any(u => u.Email == model.Email || u.SoDienThoai == model.Phone))
                {
                    return Json(new { success = false, startLogin = true, message = "Tài khoản đã tồn tại!" });
                }
                
                //mã hóa mật khẩu
                string password = HashPassword(model.Password);
                var chuSan = new ChuSan
                {

                };

                return Ok();
            }
            catch (Exception)
            {
                return Ok();
            }
        }

        //hàm mã hóa mật khẩu
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
