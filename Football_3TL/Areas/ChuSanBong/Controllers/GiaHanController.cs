using Football_3TL.Areas.ChuSanBong.Models;
using Football_3TL.Areas.Customer.Controllers;
using Football_3TL.Data;
using Football_3TL.Helper;
using Football_3TL.Services.Vnpay;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    public class GiaHanController : Controller
    {

        private readonly Football3tlContext dbContext;

        private readonly IVnPayService _vnPayService;
        private readonly ILogger<AccountController> _log;

        public GiaHanController(Football3tlContext dbContext, IVnPayService vnPayService)
        {
            this.dbContext = dbContext;
            _vnPayService = vnPayService;
        }

        [HttpPost]
        public IActionResult CreateGiaHanPaymentUrl([FromForm] ModalGiaHan model)
        {
            try
            {
                // Lấy MaChuSan từ Session
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                if (maChuSan == null || maChuSan <= 0)
                {
                    return Json(new { success = false, message = "Không tìm thấy thông tin chủ sân. Vui lòng đăng nhập lại." });
                }

                // Gán lại cho model
                model.MaChuSan = maChuSan.Value;

                // Kiểm tra các field còn lại
                if (model == null || model.MaGoi <= 0 || model.ThoiHan <= 0 || model.Gia <= 0)
                {
                    return Json(new { success = false, message = "Thông tin gia hạn không hợp lệ." });
                }

                // Lưu Session
                HttpContext.Session.SetObjectAsJson("ThongTinGiaHanTam", model);

                Console.WriteLine("=== Thông tin Gia Hạn Tạm ===");
                Console.WriteLine($"MaGoi: {model.MaGoi}");
                Console.WriteLine($"MaChuSan: {model.MaChuSan}");
                Console.WriteLine($"ThoiHan: {model.ThoiHan}");
                Console.WriteLine($"Gia: {model.Gia}");

                // Tạo URL
                var url = _vnPayService.CreateGiaHanPaymentUrl(model, HttpContext);

                return Json(new { success = true, url = url });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi CreateGiaHanPaymentUrl");
                return Json(new { success = false, message = "Có lỗi xảy ra!" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> PaymentReturn()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            if (!response.Success)
            {
                HttpContext.Session.Remove("ThongTinGiaHanTam");
                TempData["Error"] = "Thanh toán thất bại! Vui lòng thử lại.";
                return RedirectToAction("Index", "QuanLyDatSan", new { area = "ChuSanBong" });
            }

            var thongTinGiaHan = HttpContext.Session.GetObjectFromJson<ModalGiaHan>("ThongTinGiaHanTam");
            if (thongTinGiaHan == null)
            {
                return View("~/Areas/ChuSanBong/Views/VNPAY/ThatBai.cshtml");
            }

            // Lấy thông tin Đăng ký hiện tại
            var dangKy = await dbContext.ThongTinDangKies
                .FirstOrDefaultAsync(x => x.MaChuSan == thongTinGiaHan.MaChuSan);

            if (dangKy == null)
            {
                // Nếu chưa có, tạo mới
                dangKy = new ThongTinDangKy()
                {
                    MaChuSan = thongTinGiaHan.MaChuSan,
                    MaGoi = thongTinGiaHan.MaGoi,
                    NgayBd = DateTime.Now,
                    NgayKt = DateTime.Now.AddMonths(thongTinGiaHan.ThoiHan),
                    TrangThai = "Đang hoạt động"
                };
                dbContext.ThongTinDangKies.Add(dangKy);
            }
            else
            {
                if (dangKy.MaGoi == thongTinGiaHan.MaGoi)
                {
                    // 👉 Cùng gói: cộng thêm tháng
                    dangKy.NgayKt = dangKy.NgayKt.AddMonths(thongTinGiaHan.ThoiHan);
                }
                else
                {
                    // 👉 Khác gói: đổi MaGoi và cộng tháng từ NgayKt hiện tại
                    dangKy.MaGoi = thongTinGiaHan.MaGoi;
                    dangKy.NgayKt = dangKy.NgayKt.AddMonths(thongTinGiaHan.ThoiHan);
                }
            }

            // Thêm lịch sử
            var lichSu = new LichSu()
            {
                MaChuSan = thongTinGiaHan.MaChuSan,
                MaGoi = thongTinGiaHan.MaGoi,
                TongThanhToan = (decimal)thongTinGiaHan.Gia,
                ThoiGian = DateTime.Now
            };
            dbContext.LichSus.Add(lichSu);

            await dbContext.SaveChangesAsync();

            HttpContext.Session.Remove("ThongTinGiaHanTam");

            TempData["Message"] = "Gia hạn thành công!";
            return RedirectToAction("Index", "QuanLyDatSan", new { area = "ChuSanBong" });
        }

    }
}
