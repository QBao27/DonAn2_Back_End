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
                _log.LogInformation("Bắt đầu quá trình đăng ký với email: {Email}", model?.Email);
                //kiểm tra dữ liệu 
                if (model == null)
                {
                    _log.LogWarning("Đăng ký thất bại do dữ liệu không hợp lệ.");
                    return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
                }

                if (string.IsNullOrEmpty(model.FullName) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Phone) || string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.ConfirmPassword) || string.IsNullOrEmpty(model.Communes) || string.IsNullOrEmpty(model.Province) || string.IsNullOrEmpty(model.PecificAddress))
                {
                    _log.LogWarning("Đăng ký thất bại do dữ liệu không hợp lệ.");
                    return Json(new { success = false, message = "Dữ liệu bị thiếu!" });
                }

                if (_db.ChuSans.Any(u => u.Email == model.Email || u.SoDienThoai == model.Phone))
                {
                    _log.LogWarning("Đăng ký thất bại do dữ liệu không hợp lệ.");
                    return Json(new { success = false, startLogin = true, message = "Tài khoản đã tồn tại!" });
                }

                if (model.Password != model.ConfirmPassword)
                {
                    _log.LogWarning("Đăng ký thất bại do dữ liệu không hợp lệ.");
                    return Json(new { success = false, message = "Mật khẩu xác nhận không khớp!" });
                }

                //mã hóa mật khẩu
                string password = HashPassword(model.Password);

                //Tạo chủ sân mới
                var chuSan = new ChuSan
                {
                    HoVaTen = model.FullName,
                    SoDienThoai = model.Phone,
                    Email = model.Email,
                    TenSanBong = model.NameSanBong,
                    Tinh = model.Province,
                    Huyen = model.District,
                    Xa = model.Communes,
                    DiaChi = model.PecificAddress,
                };
                _log.LogInformation("Tạo chủ sân thành công với ID: {MaChuSan}", chuSan.MaChuSan);
                await _db.ChuSans.AddAsync(chuSan);
                await _db.SaveChangesAsync();

                //Tạo tài khoản mới
                var taiKhoan = new TaiKhoan
                {
                    MaChuSan = chuSan.MaChuSan,
                    MatKhau = password,
                    Quyen = 1
                };

                await _db.TaiKhoans.AddAsync(taiKhoan);
                await _db.SaveChangesAsync();
                _log.LogInformation("Tạo tài khoản cho chủ sân với ID: {MaTaiKhoan}", taiKhoan.MaTaiKhoan);

                return Json(new { success = true, message = "Tạo tài khoản thành công!" });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi đăng ký");
                return Json(new { success = false, message = "Lỗi server, vui lòng thử lại sao" });
            }
        }

        //hàm mã hóa mật khẩu
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
