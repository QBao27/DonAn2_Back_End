using Football_3TL.Areas.Customer.Models.Vnpay;
    using Football_3TL.Data;
using Football_3TL.Helper;
using Football_3TL.Libraries;
using Football_3TL.Models;
    using Football_3TL.Services.Vnpay;
    using Microsoft.AspNetCore.Mvc;
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

        //public IActionResult CreatePaymentUrlVnpay(PaymentInformationModel model)
        //{
        //    Console.WriteLine($"MaChuSan: {model.MaChuSan}");
        //    Console.WriteLine($"HoTenKH: {model.HoTenKH}");
        //    Console.WriteLine($"SoDienThoaiKH: {model.SoDienThoaiKH}");
        //    Console.WriteLine($"NgayDat: {model.NgayDat}");
        //    Console.WriteLine($"GhiChu: {model.GhiChu}");
        //    Console.WriteLine($"ThoiLuong: {model.ThoiLuong}");
        //    Console.WriteLine($"TenSan: {model.TenSan}");
        //    Console.WriteLine($"MaSan: {model.MaSan}");
        //    Console.WriteLine($"GioDat: {model.GioDat}");
        //    Console.WriteLine($"Amount: {model.Amount}");
        //    var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

        //    return Redirect(url);
        //}

        public async Task<IActionResult> CreatePaymentUrlVnpay(PaymentInformationModel model)
        {
            try
            {
                _logger.LogInformation("Bắt đầu xử lý thanh toán VNPay...");

                // Validate model
                if (model == null || string.IsNullOrWhiteSpace(model.HoTenKH) || string.IsNullOrWhiteSpace(model.SoDienThoaiKH))
                {
                    return Json(new { success = false, message = "Thông tin khách hàng không hợp lệ." });
                }

                // Tạo mã khách hàng tự động
                var lastKh = _db.KhachHangs
                    .Where(k => k.MaKhachHang.StartsWith("KH"))
                    .AsEnumerable()
                    .Select(k => new {
                        Ma = k.MaKhachHang,
                        So = int.Parse(k.MaKhachHang.Substring(2))
                    })
                    .OrderByDescending(x => x.So)
                    .FirstOrDefault();

                int newSo = lastKh != null ? lastKh.So + 1 : 1;
                string maKhachHang = $"KH{newSo:D3}";

                var kh = new KhachHang
                {
                    MaKhachHang = maKhachHang,
                    HoVaTen = model.HoTenKH,
                    SoDienThoai = model.SoDienThoaiKH
                };
                await _db.KhachHangs.AddAsync(kh);

                // Chuyển kiểu string → DateOnly
                DateOnly? ngayDat = DateOnly.TryParse(model.NgayDat, out var nd) ? nd : null;

                // Chuyển kiểu string → TimeOnly
                TimeOnly? gioDat = TimeOnly.TryParse(model.GioDat, out var gd) ? gd : null;

                // Chuyển double → int?
                int? thoiLuong = (int?)model.ThoiLuong;

                // Chuyển string → int?
                int? maSan = int.TryParse(model.MaSan, out var ms) ? ms : null;

                // Chuyển string → int? cho MaChuSan
                int? maChuSan = int.TryParse(model.MaChuSan, out var mcs) ? mcs : null;
                var datSan = new ThongTinDatSan
                {
                    MaChuSan = int.Parse(model.MaChuSan),  // <-- dùng trực tiếp từ model
                    MaKhachHang = maKhachHang,
                    NgayDat = ngayDat,
                    GioDat = gioDat,
                    ThoiLuong = thoiLuong,
                    GhiChu = model.GhiChu,
                    MaSan = maSan,
                    TenSan = model.TenSan,
                    ThoiGianDat = DateOnly.FromDateTime(DateTime.Now),
                    TrangThaiThanhToan = "Chưa thanh toán",
                    TrangThaiSan = "Đã đặt"
                };
                await _db.ThongTinDatSans.AddAsync(datSan);
                await _db.SaveChangesAsync();

                // Gọi hàm tạo URL VNPay
                var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

                return Redirect(url);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xử lý CreatePaymentUrlVnpay.");
                return Json(new { success = false, message = "Đã xảy ra lỗi trong quá trình tạo thanh toán." });
            }
        }


        [HttpGet]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);

                if (response.Success)
                {
                    _logger.LogInformation($"Thanh toán thành công. OrderId: {response.OrderId}, Mã giao dịch: {response.TransactionId}");

                    // Tìm đơn đặt sân gần nhất theo OrderId hoặc số điện thoại (tuỳ bạn lưu gì trong OrderDescription)
                    // Giả sử bạn truyền SĐT vào vnp_OrderInfo → tìm theo số điện thoại và trạng thái chưa thanh toán
                    var donDat = _db.ThongTinDatSans
                        .OrderByDescending(d => d.MaDatSan)
                        .FirstOrDefault(d => d.TrangThaiThanhToan == "Chưa thanh toán");
                    if (donDat != null)
                    {
                        donDat.TrangThaiThanhToan = "Đã thanh toán";

                        // Thêm mới hóa đơn
                        var hoaDon = new HoaDon
                        {
                            MaDatSan = donDat.MaDatSan,
                            ThoiGian = DateOnly.FromDateTime(DateTime.Now) // hoặc donDat.NgayDat nếu có
                        };

                        _db.HoaDons.Add(hoaDon);

                        await _db.SaveChangesAsync();
                    }
                }
                else
                {
                    _logger.LogWarning($"Thanh toán thất bại. VNPayCode: {response.VnPayResponseCode}");
                }

                return View("~/Areas/Customer/Views/VNPAY/Index.cshtml");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi trong PaymentCallbackVnpay.");
                return Json(new { success = false, message = "Đã xảy ra lỗi callback từ VNPay." });
            }
        }

        //[HttpGet]
        //public IActionResult PaymentCallbackVnpay()
        //{
        //    var response = _vnPayService.PaymentExecute(Request.Query);

        //    return Json(response);
        //}


    }

}
