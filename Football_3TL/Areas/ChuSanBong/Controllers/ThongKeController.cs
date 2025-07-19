using Football_3TL.Data;
using Football_3TL.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    [CheckGoiHetHan]
    public class ThongKeController : Controller
    {
        private readonly Football3tlContext dbContext;
        public ThongKeController(Football3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult SoLuongHoaDon()
        {
            // Lấy MaChuSan từ session (giá trị cứng hiện tại là 1)
            //int? maChuSan = HttpContext.Session.GetInt32("MaChuSan") ?? 1;
            //int maChuSan = 1;
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");


            if (maChuSan == null)
            {
                return BadRequest(new { message = "Không tìm thấy MaChuSan trong session" });
            }

            // Đếm số lượng hóa đơn theo MaChuSan
            var soLuong = dbContext.HoaDons
                .Count(hd => hd.MaDatSanNavigation.MaChuSan == maChuSan);

            return Json(new { MaChuSan = maChuSan, SoLuongHoaDon = soLuong });
        }

        [HttpGet]
        public IActionResult SoLuongSan()
        {
            // Lấy MaChuSan từ session (giá trị cứng hiện tại là 1)
            //int? maChuSan = HttpContext.Session.GetInt32("MaChuSan") ?? 1;
            //int maChuSan = 1;
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");

            if (maChuSan==null)
            {
                return BadRequest(new { message = "Không tìm thấy MaChuSan trong session" });
            }

            // Đếm số lượng sân theo MaChuSan
            var soLuongSan = dbContext.SanBongs.Count(s => s.MaChuSan == maChuSan);

            return Json(new { MaChuSan = maChuSan, SoLuongSan = soLuongSan });
        }

        [HttpGet]
        public IActionResult SoLuongDanhGia()
        {
            // Lấy MaChuSan từ session (ở đây đang gán cứng là 1)
            //int maChuSan = HttpContext.Session.GetInt32("MaChuSan") ?? 1;

            //int maChuSan = 1;
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");

            if (maChuSan == null)
            {
                return BadRequest(new { message = "Không tìm thấy MaChuSan trong session" });
            }

            // Đếm số lượng đánh giá theo MaChuSan
            var soLuong = dbContext.DanhGia.Count(dg => dg.MaChuSan == maChuSan);

            return Json(new { MaChuSan = maChuSan, SoLuongDanhGia = soLuong });
        }

        [HttpGet]
        public IActionResult TongGiaTriDatSan()
        {
            // Lấy MaChuSan từ session (hoặc gán cứng nếu cần)
            //int maChuSan = HttpContext.Session.GetInt32("MaChuSan") ?? 1;

            //int maChuSan = 1;
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");

            if (maChuSan == null)
            {
                return BadRequest(new { message = "Không tìm thấy MaChuSan trong session" });
            }

            var tongGiaTri = dbContext.ThongTinDatSans
                  .Where(ds => ds.MaChuSan == maChuSan)
                 .Sum(ds => ds.TongThanhToan);

            string tongGiaTriFormat = tongGiaTri.ToString("N0");

            return Json(new { MaChuSan = maChuSan, TongGiaTri = tongGiaTriFormat });
        }

        [HttpGet]
        public IActionResult DoanhThuSan()
        {
            //int maChuSan = 1;
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");

            if (maChuSan == null)
            {
                return BadRequest(new { message = "Không tìm thấy MaChuSan trong session" });
            }

            var doanhThuSan = dbContext.ThongTinDatSans
                .Where(ds => ds.MaChuSan == maChuSan && ds.ThoiLuong.HasValue && ds.MaSanNavigation.Gia.HasValue && ds.NgayDat.HasValue)
                .GroupBy(ds => new { ds.NgayDat.Value.Month, ds.TenSan })
                .Select(g => new
                {
                    Thang = g.Key.Month,
                    TenSan = g.Key.TenSan,
                    TongTien = g.Sum(ds => ds.TongThanhToan)
                })
                .OrderBy(g => g.Thang)
                .ToList();
            foreach (var ds in doanhThuSan)
            {
                Console.WriteLine($"TenSan = {ds.TenSan}");
            }

            return Json(doanhThuSan);
        }

        [HttpGet]
        public IActionResult DoanhThuTheoThang()
        {
            //int maChuSan = 1; // Giả sử lấy từ session
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");

            var doanhThuTheoThang = dbContext.ThongTinDatSans
           .Include(ds => ds.MaSanNavigation) // Nạp dữ liệu bảng liên quan
           .Where(ds => ds.MaChuSan == maChuSan && ds.ThoiLuong.HasValue && ds.MaSanNavigation != null && ds.MaSanNavigation.Gia.HasValue && ds.NgayDat.HasValue)
           .ToList()
           .GroupBy(ds => ds.NgayDat.Value.ToDateTime(TimeOnly.MinValue).Month)
           .Select(g => new
           {
              Thang = g.Key,
              TongTien = g.Sum(ds => ds.TongThanhToan) // Dùng ! để đảm bảo không null
           })
           .OrderBy(g => g.Thang)
           .ToList();
            return Json(doanhThuTheoThang);
        }


    }
}
