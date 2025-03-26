using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.ChuSan.Controllers
{
    [Area("ChuSan")]
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
            var danhSachHoaDon = dbContext.HoaDons
                .Include(hd => hd.MaDatSanNavigation)
                .ThenInclude(ds => ds.MaKhachHangNavigation) // Lấy thông tin khách hàng
                .Include(hd => hd.MaDatSanNavigation.MaSanNavigation) // Lấy thông tin sân bóng
                .Select(hd => new
                {
                    MaHoaDon = "HD" + hd.MaHoaDon, // Mã hóa đơn có định dạng
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
