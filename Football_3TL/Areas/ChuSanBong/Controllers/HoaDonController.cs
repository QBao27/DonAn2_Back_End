using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    public class HoaDonController : Controller
    {
        private readonly Football3tlContext dbContext;
        public HoaDonController(Football3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult DanhSachHoaDon()
        {
            // Lấy MaChuSan từ session
            //var maChuSan = HttpContext.Session.GetInt32("MaChuSan");

            var maChuSan = 1;

            if (maChuSan == null)
            {
                return Json(new { error = "Không tìm thấy MaChuSan trong session." });
            }

            var danhSachHoaDon = dbContext.HoaDons
                .Include(hd => hd.MaDatSanNavigation)
                .ThenInclude(ds => ds.MaKhachHangNavigation) // Lấy thông tin khách hàng
                .Include(hd => hd.MaDatSanNavigation.MaSanNavigation) // Lấy thông tin sân bóng
                .Where(hd => hd.MaDatSanNavigation.MaChuSan == maChuSan) // Lọc theo MaChuSan
                .Select(hd => new
                {
                    MaHoaDon = "HD" + hd.MaHoaDon,
                    TenSan = hd.MaDatSanNavigation.MaSanNavigation != null ? hd.MaDatSanNavigation.MaSanNavigation.TenSan : "Chưa có",
                    TenKhachHang = hd.MaDatSanNavigation.MaKhachHangNavigation != null ? hd.MaDatSanNavigation.MaKhachHangNavigation.HoVaTen : "Chưa có",
                    ThoiGian = hd.MaDatSanNavigation.NgayDat.HasValue && hd.MaDatSanNavigation.GioDat.HasValue
                                ? hd.MaDatSanNavigation.NgayDat.Value.ToString("dd/MM/yyyy") + " - " + hd.MaDatSanNavigation.GioDat.Value.ToString("HH:mm")
                                : "Chưa có",
                    TongGiaTri = (hd.MaDatSanNavigation.MaSanNavigation != null && hd.MaDatSanNavigation.ThoiLuong.HasValue)
                                ? $"{((double)(hd.MaDatSanNavigation.MaSanNavigation.Gia * (hd.MaDatSanNavigation.ThoiLuong.Value / 60.0))).ToString("N0")} VND"
                                : "Chưa có"
                })
                .ToList();

            return Json(danhSachHoaDon);
        }


    }
}
