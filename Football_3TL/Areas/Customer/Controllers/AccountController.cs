using Football_3TL.Areas.Customer.Models;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Football_3TL.Services.Vnpay;
using Football_3TL.Helper;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Football_3TL.Services.Email;


namespace Football_3TL.Areas.Customer.Controllers
{
    [Area("Customer")]
    public class AccountController : Controller
    {
        //thay thế cho database
        private readonly Football3tlContext _db;
        //tạo logger để ghi log để dễ kiểm tra lỗi
        private readonly ILogger<AccountController> _log;

        private readonly IVnPayService _vnPayService;

        private readonly IEmailService _emailService;

        //tạo contructor 
        public AccountController(Football3tlContext db, ILogger<AccountController> log, IVnPayService vnPayService, IEmailService emailService)
        {
            _db = db;
            _log = log;
            _vnPayService = vnPayService;
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> CheckPhoneEmailExists(string Phone, string Email)
        {
            var exist = await _db.ChuSans
                .FirstOrDefaultAsync(x => x.SoDienThoai == Phone || x.Email.ToLower() == Email.ToLower());

            if (exist != null)
            {
                return Json(new { success = false, message = "Số điện thoại hoặc Email đã tồn tại!" });
            }

            return Json(new { success = true });
        }


        [HttpPost]
        public async Task<IActionResult> CreateDangKyPaymentUrl(SignUpPaymentModel model)
        {
            try
            {
                if (model == null || string.IsNullOrWhiteSpace(model.FullName) || string.IsNullOrWhiteSpace(model.Phone))
                {
                    return Json(new { success = false, message = "Thông tin đăng ký không hợp lệ." });
                }
                var emailTrung = await _db.ChuSans.AnyAsync(x => x.Email.ToLower() == model.Email.ToLower());

                var sdtTrung = await _db.ChuSans
                    .AnyAsync(x => x.SoDienThoai == model.Phone);

                if (emailTrung && sdtTrung)
                {
                    return Json(new { success = false, message = "Email và số điện thoại đã tồn tại!" });
                }
                else if (emailTrung)
                {
                    return Json(new { success = false, message = "Email đã tồn tại!" });
                }
                else if (sdtTrung)
                {
                    return Json(new { success = false, message = "Số điện thoại đã tồn tại!" });
                }
                // Lưu thông tin ĐĂNG KÝ vào Session
                HttpContext.Session.SetObjectAsJson("ThongTinDangKyTam", model);

                // In ra để debug
                var thongTin = HttpContext.Session.GetObjectFromJson<SignUpPaymentModel>("ThongTinDangKyTam");
                if (thongTin != null)
                {
                    Console.WriteLine("=== Thông tin đăng ký tạm ===");
                    Console.WriteLine($"Họ tên: {thongTin.FullName}");
                    Console.WriteLine($"SĐT: {thongTin.Phone}");
                    Console.WriteLine($"Email: {thongTin.Email}");
                    Console.WriteLine($"Tên Sân: {thongTin.SanBongName}");
                    Console.WriteLine($"Địa chỉ: {thongTin.DiaChiTinh} - {thongTin.DiaChiHuyen} - {thongTin.DiaChiXa} - {thongTin.DiaChiCuThe}");
                    Console.WriteLine($"Gói: {thongTin.MaGoi} - Số tiền: {thongTin.SoTien}");
                }

                //// Gọi VNPayService tạo URL
                //var url = _vnPayService.CreateDangKyPaymentUrl(thongTin, HttpContext);

                //return Redirect(url);

                var url = _vnPayService.CreateDangKyPaymentUrl(thongTin, HttpContext);

                // ✅ Thay vì Redirect(url), trả về JSON:
                return Json(new { success = true, url = url });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi trong CreatePaymentUrlVnpay_SignUp");
                return Json(new { success = false, message = "Có lỗi xảy ra." });
            }
        }


        //Hàm đăng ký
        //[HttpPost] //dùng formbody khi gửi dữ liệu bằng json or ajax chứ k phải trong from
        //public async Task<IActionResult> SignUp([FromBody] modelSignUp model)
        //{
        //    try
        //    {
        //        _log.LogInformation("Bắt đầu quá trình đăng ký với email: {Email}", model?.Email);
        //        //kiểm tra dữ liệu 
        //        if (model == null)
        //        {
        //            _log.LogWarning("Đăng ký thất bại do dữ liệu không hợp lệ.");
        //            return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
        //        }

        //        if (string.IsNullOrEmpty(model.FullName) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Phone) || string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.ConfirmPassword) || string.IsNullOrEmpty(model.Communes) || string.IsNullOrEmpty(model.Province) || string.IsNullOrEmpty(model.PecificAddress))
        //        {
        //            _log.LogWarning("Đăng ký thất bại do dữ liệu không hợp lệ.");
        //            return Json(new { success = false, message = "Dữ liệu bị thiếu!" });
        //        }

        //        if (_db.ChuSans.Any(u => u.Email == model.Email || u.SoDienThoai == model.Phone))
        //        {
        //            _log.LogWarning("Đăng ký thất bại do dữ liệu không hợp lệ.");
        //            return Json(new { success = false, message = "Tài khoản đã tồn tại!" });
        //        }

        //        if (model.Password != model.ConfirmPassword)
        //        {
        //            _log.LogWarning("Đăng ký thất bại do dữ liệu không hợp lệ.");
        //            return Json(new { success = false, message = "Mật khẩu xác nhận không khớp!" });
        //        }

        //        //mã hóa mật khẩu
        //        string password = HashPassword(model.Password);

        //        //Tạo chủ sân mới
        //        var chuSan = new ChuSan
        //        {
        //            HoVaTen = model.FullName,
        //            SoDienThoai = model.Phone,
        //            Email = model.Email,
        //            TenSanBong = model.NameSanBong,
        //            Tinh = model.Province,
        //            Huyen = model.District,
        //            Xa = model.Communes,
        //            DiaChi = model.PecificAddress,
        //        };
        //        _log.LogInformation("Tạo chủ sân thành công với ID: {MaChuSan}", chuSan.MaChuSan);
        //        await _db.ChuSans.AddAsync(chuSan);
        //        await _db.SaveChangesAsync();

        //        //Tạo tài khoản mới
        //        var taiKhoan = new TaiKhoan
        //        {
        //            MaChuSan = chuSan.MaChuSan,
        //            MatKhau = password,
        //            Quyen = 1,
        //            TrangThai = "2"
        //        };

        //        await _db.TaiKhoans.AddAsync(taiKhoan);
        //        await _db.SaveChangesAsync();
        //        _log.LogInformation("Tạo tài khoản cho chủ sân với ID: {MaTaiKhoan}", taiKhoan.MaTaiKhoan);

        //        //Tạo thông tin bài đăng mới 
        //        // Lấy mã bài đăng lớn nhất hiện tại
        //        var lastMaBaiDang = await _db.ThongTinBaiDangs
        //            .OrderByDescending(x => x.MaBaiDang)
        //            .Select(x => x.MaBaiDang)
        //            .FirstOrDefaultAsync();

        //        string newMaBaiDang = "BD001"; // Mặc định nếu chưa có bài đăng nào

        //        if (!string.IsNullOrEmpty(lastMaBaiDang))
        //        {
        //            // Tách phần số phía sau "BD"
        //            int number = int.Parse(lastMaBaiDang.Substring(2));
        //            number++; // tăng lên 1
        //            newMaBaiDang = "BD" + number.ToString("D3"); // định dạng về BD00x
        //        }

        //        // Tạo mới bài đăng
        //        var baiDang = new ThongTinBaiDang
        //        {
        //            MaBaiDang = newMaBaiDang,
        //            GioMoCua = 6,
        //            GioDongCua = 22,
        //            MaChuSan = chuSan.MaChuSan
        //        };

        //        await _db.ThongTinBaiDangs.AddAsync(baiDang);
        //        await _db.SaveChangesAsync();

        //        //Tạo 4 hình ảnh mặc định
        //        var hinhAnhs = new List<HinhAnhBaiDang>();
        //        for (int i = 1; i <= 4; i++)
        //        {
        //            hinhAnhs.Add(new HinhAnhBaiDang
        //            {
        //                MaBaiDang = baiDang.MaBaiDang,
        //                HinhAnh = $"/Img/anhSanBongDefault.png",  // pattern chung
        //                ThuTu = i
        //            });
        //        }

        //        // Lưu vào database
        //        _db.HinhAnhBaiDangs.AddRange(hinhAnhs);
        //        await _db.SaveChangesAsync();


        //        return Json(new { success = true, message = "Tạo tài khoản thành công!" });
        //    }
        //    catch (Exception ex)
        //    {
        //        _log.LogError(ex, "Lỗi khi đăng ký");
        //        return Json(new { success = false, message = "Lỗi server, vui lòng thử lại sao" });
        //    }
        //}

        public async Task<IActionResult> PaymentReturn()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            if (!response.Success)
            {
                // Xoá session vì giao dịch thất bại
                HttpContext.Session.Remove("ThongTinDatSanTam");

                return View("~/Areas/Customer/Views/VNPAY/ThatBai.cshtml");
            }

            var model = HttpContext.Session.GetObjectFromJson<SignUpPaymentModel>("ThongTinDangKyTam");
            if (model == null)
            {
                return Content("Không tìm thấy thông tin đăng ký, vui lòng thử lại!");
            }

            string password = HashPassword(model.PassWord);

            var chuSan = new ChuSan
            {
                HoVaTen = model.FullName,
                SoDienThoai = model.Phone,
                Email = model.Email,
                TenSanBong = model.SanBongName,
                Tinh = model.DiaChiTinh,
                Huyen = model.DiaChiHuyen,
                Xa = model.DiaChiXa,
                DiaChi = model.DiaChiCuThe
            };

            await _db.ChuSans.AddAsync(chuSan);
            await _db.SaveChangesAsync();

            var taiKhoan = new TaiKhoan
            {
                MaChuSan = chuSan.MaChuSan,
                MatKhau = password,
                Quyen = 1,
                TrangThai = "2"
            };

            await _db.TaiKhoans.AddAsync(taiKhoan);

            var lastMaBaiDang = await _db.ThongTinBaiDangs.OrderByDescending(x => x.MaBaiDang).Select(x => x.MaBaiDang).FirstOrDefaultAsync();
            string newMaBaiDang = "BD001";
            if (!string.IsNullOrEmpty(lastMaBaiDang))
            {
                int number = int.Parse(lastMaBaiDang.Substring(2));
                number++;
                newMaBaiDang = "BD" + number.ToString("D3");
            }

            var baiDang = new ThongTinBaiDang
            {
                MaBaiDang = newMaBaiDang,
                GioMoCua = 6,
                GioDongCua = 22,
                MaChuSan = chuSan.MaChuSan
            };

            await _db.ThongTinBaiDangs.AddAsync(baiDang);

            var hinhAnhs = new List<HinhAnhBaiDang>();
            for (int i = 1; i <= 4; i++)
            {
                hinhAnhs.Add(new HinhAnhBaiDang
                {
                    MaBaiDang = baiDang.MaBaiDang,
                    HinhAnh = "/Img/anhSanBongDefault.png",
                    ThuTu = i
                });
            }
            _db.HinhAnhBaiDangs.AddRange(hinhAnhs);

            var thongTinDangKy = new ThongTinDangKy
            {
                MaChuSan = chuSan.MaChuSan,
                MaGoi = int.Parse(model.MaGoi),
                NgayBd = DateTime.Now,
                NgayKt = DateTime.Now.AddMonths(6),
                TrangThai = "Đang hoạt động"
            };
            await _db.ThongTinDangKies.AddAsync(thongTinDangKy);

            var lichSu = new LichSu
            {
                MaChuSan = chuSan.MaChuSan,
                MaGoi = int.Parse(model.MaGoi),
                TongThanhToan = (decimal)model.SoTien,
                ThoiGian = DateTime.Now
            };
            await _db.LichSus.AddAsync(lichSu);

            await _db.SaveChangesAsync();

            // Gửi email xác nhận đăng ký
            string subject = "Xác nhận đăng ký chủ sân thành công";
            string body = $@"
                    <p>Xin chào <strong>{chuSan.HoVaTen}</strong>,</p>
                    <p>Chúc mừng bạn đã đăng ký thành công sân bóng <strong>{chuSan.TenSanBong}</strong>.</p>
                    <p><strong>Thời hạn gói:</strong> {thongTinDangKy.NgayBd:dd/MM/yyyy} - {thongTinDangKy.NgayKt:dd/MM/yyyy}</p>
                    <p><strong>Số tiền đã thanh toán:</strong> {model.SoTien:N0} VND</p>
                    <p>Bạn có thể sử dụng <b> Số điện thoại </b> hoặc <b> Gmail </b>  để đăng nhập vào hệ thống</p>
                    <p>Mật khẩu của bạn là: <b> {model.PassWord} </b> </p>
                    <p>Hệ thống sân bóng <b> FootBall 3Tl</b> xin cảm ơn!</p>
                ";

            try
            {
                await _emailService.SendEmailAsync(chuSan.Email, subject, body);
            }
            catch (Exception ex)
            {
                _log.LogWarning($"Gửi email thất bại: {ex.Message}");
            }

            return View("~/Areas/Customer/Views/VNPAY/ThanhCong.cshtml");
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
