﻿using Football_3TL.Areas.Customer.Models;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;


namespace Football_3TL.Areas.Customer.Controllers
{
    [Area("Customer")]
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
                    return Json(new { success = false,  message = "Tài khoản đã tồn tại!" });
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
                    Quyen = 1,
                    TrangThai = "2"
                };

                await _db.TaiKhoans.AddAsync(taiKhoan);
                await _db.SaveChangesAsync();
                _log.LogInformation("Tạo tài khoản cho chủ sân với ID: {MaTaiKhoan}", taiKhoan.MaTaiKhoan);

                //Tạo thông tin bài đăng mới 
                // Lấy mã bài đăng lớn nhất hiện tại
                var lastMaBaiDang = await _db.ThongTinBaiDangs
                    .OrderByDescending(x => x.MaBaiDang)
                    .Select(x => x.MaBaiDang)
                    .FirstOrDefaultAsync();

                string newMaBaiDang = "BD001"; // Mặc định nếu chưa có bài đăng nào

                if (!string.IsNullOrEmpty(lastMaBaiDang))
                {
                    // Tách phần số phía sau "BD"
                    int number = int.Parse(lastMaBaiDang.Substring(2));
                    number++; // tăng lên 1
                    newMaBaiDang = "BD" + number.ToString("D3"); // định dạng về BD00x
                }

                // Tạo mới bài đăng
                var baiDang = new ThongTinBaiDang
                {
                    MaBaiDang = newMaBaiDang,
                    GioMoCua = 6,
                    GioDongCua = 22,
                    MaChuSan = chuSan.MaChuSan
                };

                await _db.ThongTinBaiDangs.AddAsync(baiDang);
                await _db.SaveChangesAsync();

                //Tạo 4 hình ảnh mặc định
                var hinhAnhs = new List<HinhAnhBaiDang>();
                for (int i = 1; i <= 4; i++)
                {
                    hinhAnhs.Add(new HinhAnhBaiDang
                    {
                        MaBaiDang = baiDang.MaBaiDang,
                        HinhAnh = $"/Img/anhSanBongDefault.png",  // pattern chung
                        ThuTu = i
                    });
                }

                // Lưu vào database
                _db.HinhAnhBaiDangs.AddRange(hinhAnhs);
                await _db.SaveChangesAsync();


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

        //Hàm đăng nhập
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] ModelLogin model)
        {
            try
            {
                _log.LogInformation("Bắt đầu quá trình đăng nhập với tài khoản: {0}", model?.TaiKhoan);
                if (model == null || string.IsNullOrWhiteSpace(model.TaiKhoan) || string.IsNullOrWhiteSpace(model.MatKhau))
                {
                    _log.LogWarning("Đăng nhập thất bại: Dữ liệu không hợp lệ");
                    return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
                }

                //lấy thông tin chủ sân
                var user = await _db.ChuSans.FirstOrDefaultAsync(u => u.Email == model.TaiKhoan || u.SoDienThoai == model.TaiKhoan);

                if (user == null)
                {
                    _log.LogWarning("Đăng nhập thất bại: Không tìm thấy chủ sân");
                    return Json(new { success = false, message = "Tài khoản chưa được đăng ký!" });
                }

                //lấy tài khoản của user
                var taiKhoan = await _db.TaiKhoans.FirstOrDefaultAsync(t => t.MaChuSan == user.MaChuSan);

                //kiểm tra tài khoản
                if (taiKhoan == null)
                {
                    _log.LogWarning("Đăng nhập thất bại: Không tìm thấy tài khoản của chủ sân {0}", user.MaChuSan);
                    return Json(new { success = false, message = "Không tìm thấy tài khoản!" });
                }

                // Kiểm tra mật khẩu
                if (!VerifyPassword(model.MatKhau, taiKhoan.MatKhau ?? ""))
                {
                    _log.LogWarning("Đăng nhập thất bại: Sai mật khẩu cho user: {0}", user.MaChuSan);
                    return Json(new { success = false, checkPassword = false, message = $"Mật khẩu không đúng!"});
                }

                if(taiKhoan.TrangThai == "1")
                {
                    return Json(new { success = false, checkPassword = false, message = $"Tài khoản đã bị khóa!"});
                }

                //Lưu thông tin vào session
                HttpContext.Session.SetInt32("maChuSan", user.MaChuSan);
                HttpContext.Session.SetString("tenChuSan", user.HoVaTen ?? "");
                HttpContext.Session.SetString("emailChuSan", user.Email ?? "");
                HttpContext.Session.SetString("soDienThoaiChuSan", user.SoDienThoai ?? "");
                HttpContext.Session.SetString("tenSanBong", user.TenSanBong ?? "");


                _log.LogInformation("Đăng nhập thành công với tài khoản chủ sân: {0}", user.MaChuSan);

                if(taiKhoan.Quyen == 1)
                {
                    Console.WriteLine(taiKhoan.TrangThai);
                    return Json(new { success = true, redirectUrl = Url.Action("Index", "QuanLyDatSan", new { area = "ChuSanBong" }) });
                }
                else if(taiKhoan.Quyen == 2)
                {
                    return Json(new { success = true, redirectUrl = Url.Action("Index", "QuanLyTaiKhoan", new { area = "Admin" }) });
                }
                else
                {
                    return Json(new { success = true, redirectUrl = Url.Action("Index", "Home", new { area = "Customer" }) });
                }
            }
            catch (Exception)
            {
                _log.LogError("Lỗi trong quá trình đăng nhập cho tài khoản: {0}", model.TaiKhoan);
                return Json(new { success = false, message = "Lỗi server, vui lòng thử lại sau!" });
            }
        }

        //Giải mã mật khẩu
        private bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hashedPassword))
                return false;
             
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }

        //Hàm đăng xuất 
        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); // Xóa toàn bộ session của người dùng
            return RedirectToAction("Index", "Home", new { area = "Customer" }); // Chuyển hướng về Customer/Home/Index
        }

    }
}
