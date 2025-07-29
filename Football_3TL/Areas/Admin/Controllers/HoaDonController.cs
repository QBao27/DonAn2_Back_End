using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class HoaDonController : Controller
    {
        private readonly Football3tlContext _db;

        public HoaDonController(Football3tlContext db)
        {
            _db = db;
        }
       
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult DanhSachLichSu()
        {
            var danhSachLichSu = _db.LichSus
                .Include(ls => ls.MaChuSanNavigation)
                .Include(ls => ls.MaGoiNavigation)
                .Select(ls => new
                {
                    MaLichSu = ls.MaLichSu,
                    TenChuSan = ls.MaChuSanNavigation != null ? ls.MaChuSanNavigation.HoVaTen : "Chưa có",
                    TenSan = ls.MaChuSanNavigation != null ? ls.MaChuSanNavigation.TenSanBong : "Chưa có",
                    ThoiHan = ls.MaGoiNavigation != null ? ls.MaGoiNavigation.ThoiHan + " tháng" : "Chưa có",
                    NgayThanhToan = ls.ThoiGian.HasValue ? ls.ThoiGian.Value.ToString("dd/MM/yyyy") : "Chưa có",
                    TongTien = ls.TongThanhToan
                })
                .ToList();

            return Json(danhSachLichSu);
        }
    }
}
