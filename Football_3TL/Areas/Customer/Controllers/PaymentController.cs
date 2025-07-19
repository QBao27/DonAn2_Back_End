using Football_3TL.Areas.Customer.Models;
using Football_3TL.Areas.Customer.Models.Vnpay;
    using Football_3TL.Data;
using Football_3TL.Helper;
using Football_3TL.Libraries;
using Football_3TL.Models;
    using Football_3TL.Services.Vnpay;
    using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
namespace Football_3TL.Areas.Customer.Controllers
{

  [Area("Customer")]
    public class PaymentController : Controller
    {

        private readonly IVnPayService _vnPayService;
        private readonly Football3tlContext _db;
        private readonly ILogger<PaymentController> _logger;
        public PaymentController(IVnPayService vnPayService, Football3tlContext db, ILogger<PaymentController> logger)
        {
            _vnPayService = vnPayService;
            _db = db;
            _logger = logger;
        }

        //public async Task<IActionResult> CreatePaymentUrlVnpay(PaymentInformationModel model)
        //{
        //    try
        //    {
        //        _logger.LogInformation("Bắt đầu xử lý thanh toán VNPay...");

        //        // Validate model
        //        if (model == null || string.IsNullOrWhiteSpace(model.HoTenKH) || string.IsNullOrWhiteSpace(model.SoDienThoaiKH))
        //        {
        //            return Json(new { success = false, message = "Thông tin khách hàng không hợp lệ." });
        //        }

        //        // Tạo mã khách hàng tự động
        //        var lastKh = _db.KhachHangs
        //            .Where(k => k.MaKhachHang.StartsWith("KH"))
        //            .AsEnumerable()
        //            .Select(k => new {
        //                Ma = k.MaKhachHang,
        //                So = int.Parse(k.MaKhachHang.Substring(2))
        //            })
        //            .OrderByDescending(x => x.So)
        //            .FirstOrDefault();

        //        int newSo = lastKh != null ? lastKh.So + 1 : 1;
        //        string maKhachHang = $"KH{newSo:D3}";

        //        var kh = new KhachHang
        //        {
        //            MaKhachHang = maKhachHang,
        //            HoVaTen = model.HoTenKH,
        //            SoDienThoai = model.SoDienThoaiKH
        //        };
        //        await _db.KhachHangs.AddAsync(kh);

        //        // Chuyển kiểu string → DateOnly
        //        DateOnly? ngayDat = DateOnly.TryParse(model.NgayDat, out var nd) ? nd : null;

        //        // Chuyển kiểu string → TimeOnly
        //        TimeOnly? gioDat = TimeOnly.TryParse(model.GioDat, out var gd) ? gd : null;

        //        // Chuyển double → int?
        //        int? thoiLuong = (int?)model.ThoiLuong;

        //        // Chuyển string → int?
        //        int? maSan = int.TryParse(model.MaSan, out var ms) ? ms : null;

        //        // Chuyển string → int? cho MaChuSan
        //        int? maChuSan = int.TryParse(model.MaChuSan, out var mcs) ? mcs : null;
        //        var datSan = new ThongTinDatSan
        //        {
        //            MaChuSan = int.Parse(model.MaChuSan),  // <-- dùng trực tiếp từ model
        //            MaKhachHang = maKhachHang,
        //            NgayDat = ngayDat,
        //            GioDat = gioDat,
        //            ThoiLuong = thoiLuong,
        //            GhiChu = model.GhiChu,
        //            MaSan = maSan,
        //            TenSan = model.TenSan,
        //            ThoiGianDat = DateOnly.FromDateTime(DateTime.Now),
        //            TrangThaiThanhToan = "Chưa thanh toán",
        //            TrangThaiSan = "Đã đặt"
        //        };
        //        await _db.ThongTinDatSans.AddAsync(datSan);
        //        await _db.SaveChangesAsync();

        //        // Gọi hàm tạo URL VNPay
        //        var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

        //        return Redirect(url);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Lỗi khi xử lý CreatePaymentUrlVnpay.");
        //        return Json(new { success = false, message = "Đã xảy ra lỗi trong quá trình tạo thanh toán." });
        //    }
        //}

        [HttpPost]
        public async Task<IActionResult> CreatePaymentUrlVnpay(PaymentInformationModel model)
        {
            try
            {
                if (model == null || string.IsNullOrWhiteSpace(model.HoTenKH) || string.IsNullOrWhiteSpace(model.SoDienThoaiKH))
                {
                    return Json(new { success = false, message = "Thông tin khách hàng không hợp lệ." });
                }

                Console.WriteLine("==== DỮ LIỆU NHẬN TỪ CLIENT ====");
                Console.WriteLine($"HoTenKH: {model.HoTenKH}");
                Console.WriteLine($"SoDienThoaiKH: {model.SoDienThoaiKH}");
                Console.WriteLine($"MaChuSan: {model.MaChuSan}");
                Console.WriteLine($"NgayDat (string): {model.NgayDat}");
                Console.WriteLine($"Amount (gốc): {model.Amount}");

                decimal tongThanhToan = model.Amount;

                // Kiểm tra khuyến mãi
                var ngayDatParsed = DateOnly.Parse(model.NgayDat);
                var khuyenMai = await _db.KhuyenMais
                    .Where(km => km.MaChuSan == int.Parse(model.MaChuSan) &&
                                 km.NgayBd <= ngayDatParsed &&
                                 km.NgayKt >= ngayDatParsed && km.TrangThai == "Đang diễn ra")
                    .OrderByDescending(km => km.GiamGia)
                    .FirstOrDefaultAsync();

                if (khuyenMai != null)
                {
                    var giamGia = tongThanhToan * (khuyenMai.GiamGia / 100);
                    tongThanhToan -= giamGia;
                }
                else
                {
                    Console.WriteLine("Không có khuyến mãi áp dụng.");
                }

                // Lưu thông tin đặt sân tạm vào session
                var thongTinDatSanTam = new ThongTinDatSanTam
                {
                    MaChuSan = int.Parse(model.MaChuSan),
                    NgayDat = ngayDatParsed,
                    GioDat = TimeOnly.Parse(model.GioDat),
                    ThoiLuong = (int)model.ThoiLuong,
                    MaSan = int.Parse(model.MaSan),
                    TenSan = model.TenSan,
                    GhiChu = model.GhiChu,
                    HoTenKH = model.HoTenKH,
                    SoDienThoaiKH = model.SoDienThoaiKH,
                    TongThanhToan = tongThanhToan
                };

                model.Amount = tongThanhToan;

                Console.WriteLine("Gia: ", model.Amount);

                HttpContext.Session.SetObjectAsJson("ThongTinDatSanTam", thongTinDatSanTam);

                var thongTinInRa = HttpContext.Session.GetObjectFromJson<ThongTinDatSanTam>("ThongTinDatSanTam");
                // Tạo URL thanh toán VNPay
                var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

                return Redirect(url);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi trong CreatePaymentUrlVnpay.");
                return Json(new { success = false, message = "Lỗi tạo thanh toán." });
            }
        }




        //[HttpGet]
        //public async Task<IActionResult> PaymentCallbackVnpay()
        //{
        //    try
        //    {
        //        var response = _vnPayService.PaymentExecute(Request.Query);

        //        if (response.Success)
        //        {
        //            _logger.LogInformation($"Thanh toán thành công. OrderId: {response.OrderId}, Mã giao dịch: {response.TransactionId}");

        //            // Tìm đơn đặt sân gần nhất theo OrderId hoặc số điện thoại (tuỳ bạn lưu gì trong OrderDescription)
        //            // Giả sử bạn truyền SĐT vào vnp_OrderInfo → tìm theo số điện thoại và trạng thái chưa thanh toán
        //            var donDat = _db.ThongTinDatSans
        //                .OrderByDescending(d => d.MaDatSan)
        //                .FirstOrDefault(d => d.TrangThaiThanhToan == "Chưa thanh toán");
        //            if (donDat != null)
        //            {
        //                donDat.TrangThaiThanhToan = "Đã thanh toán";

        //                // Thêm mới hóa đơn
        //                var hoaDon = new HoaDon
        //                {
        //                    MaDatSan = donDat.MaDatSan,
        //                    ThoiGian = DateOnly.FromDateTime(DateTime.Now) // hoặc donDat.NgayDat nếu có
        //                };

        //                _db.HoaDons.Add(hoaDon);

        //                await _db.SaveChangesAsync();
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogWarning($"Thanh toán thất bại. VNPayCode: {response.VnPayResponseCode}");
        //        }

        //        return View("~/Areas/Customer/Views/VNPAY/Index.cshtml");
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Lỗi trong PaymentCallbackVnpay.");
        //        return Json(new { success = false, message = "Đã xảy ra lỗi callback từ VNPay." });
        //    }
        //}

        [HttpGet]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);

                if (response.Success)
                {
                    _logger.LogInformation($"Thanh toán thành công. OrderId: {response.OrderId}, Mã giao dịch: {response.TransactionId}");

                    // Đọc dữ liệu đặt sân từ Session
                    var thongTinDatSanTam = HttpContext.Session.GetObjectFromJson<ThongTinDatSanTam>("ThongTinDatSanTam");

                    if (thongTinDatSanTam == null)
                    {
                        _logger.LogWarning("Không tìm thấy dữ liệu đặt sân trong session.");
                        return RedirectToAction("ThatBai", "VNPAY", new { area = "Customer" });
                    }

                    // Tạo mã khách hàng tự động
                    var lastKh = _db.KhachHangs
                        .Where(k => k.MaKhachHang.StartsWith("KH"))
                        .AsEnumerable()
                        .Select(k => new { Ma = k.MaKhachHang, So = int.Parse(k.MaKhachHang.Substring(2)) })
                        .OrderByDescending(x => x.So)
                        .FirstOrDefault();

                    int newSo = lastKh != null ? lastKh.So + 1 : 1;
                    string maKhachHang = $"KH{newSo:D3}";

                    // Tạo khách hàng
                    var kh = new KhachHang
                    {
                        MaKhachHang = maKhachHang,
                        HoVaTen = thongTinDatSanTam.HoTenKH ?? "Khách hàng",
                        SoDienThoai = thongTinDatSanTam.SoDienThoaiKH ?? "Không rõ"
                    };
                    await _db.KhachHangs.AddAsync(kh);

                    // Tạo đơn đặt sân
                    var datSan = new ThongTinDatSan
                    {
                        MaChuSan = thongTinDatSanTam.MaChuSan,
                        MaKhachHang = maKhachHang,
                        NgayDat = thongTinDatSanTam.NgayDat,
                        GioDat = thongTinDatSanTam.GioDat,
                        ThoiLuong = thongTinDatSanTam.ThoiLuong,
                        MaSan = thongTinDatSanTam.MaSan,
                        TenSan = thongTinDatSanTam.TenSan,
                        GhiChu = thongTinDatSanTam.GhiChu,
                        TongThanhToan = thongTinDatSanTam.TongThanhToan,
                        ThoiGianDat = DateOnly.FromDateTime(DateTime.Now),
                        TrangThaiThanhToan = "Đã thanh toán",
                        TrangThaiSan = "Đã đặt"
                    };
                    await _db.ThongTinDatSans.AddAsync(datSan);

                    // Lưu khách hàng và đơn đặt sân trước
                    await _db.SaveChangesAsync();

                    // Sau khi SaveChangesAsync() thì datSan.MaDatSan mới có giá trị (nếu là Identity tự tăng)

                    // Tạo hóa đơn
                    var hoaDon = new HoaDon
                    {
                        MaDatSan = datSan.MaDatSan,
                        ThoiGian = DateOnly.FromDateTime(DateTime.Now),
                    };
                    await _db.HoaDons.AddAsync(hoaDon);

                    // Lưu hóa đơn
                    await _db.SaveChangesAsync();

                    // Xoá session
                    HttpContext.Session.Remove("ThongTinDatSanTam");

                    return View("~/Areas/Customer/Views/VNPAY/ThanhCong.cshtml"); // View báo thành công
                }
                else
                {
                    _logger.LogWarning($"Thanh toán thất bại hoặc bị huỷ. VNPayCode: {response.VnPayResponseCode}");

                    // Xoá session vì giao dịch thất bại
                    HttpContext.Session.Remove("ThongTinDatSanTam");

                    return View("~/Areas/Customer/Views/VNPAY/ThatBai.cshtml"); // View báo thất bại
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi trong PaymentCallbackVnpay.");
                return RedirectToAction("LoiHeThong", "Error");
            }
        }
    }

}
