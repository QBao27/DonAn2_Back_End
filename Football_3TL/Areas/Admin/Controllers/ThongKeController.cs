using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ThongKeController : Controller
    {
        private readonly Football3tlContext _db;

        public ThongKeController(Football3tlContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ThongKeTongQuan()
        {
            decimal tongDoanhThu = _db.LichSus.Sum(ls => ls.TongThanhToan);
            int soLuongHoaDon = _db.LichSus.Count();
            int tongChuSan = _db.ChuSans.Count();
            int soluongSan = _db.SanBongs.Count();

            return Json(new
            {
                TongDoanhThu = tongDoanhThu,
                SoLuongHoaDon = soLuongHoaDon,
                TongChuSan = tongChuSan,
                SoluongSan = soluongSan
            });
        }
        public IActionResult DoanhThuTheoChuSan()
        {
            var chiTiet = _db.ThongTinDatSans
                .Include(ds => ds.MaChuSanNavigation)
                .Where(ds => ds.NgayDat.HasValue && ds.TrangThaiThanhToan == "Đã thanh toán")
                .Select(ds => new
                {
                    MaChuSan = ds.MaChuSan,
                    TenChuSan = ds.MaChuSanNavigation != null ? ds.MaChuSanNavigation.HoVaTen : "Chưa xác định",
                    TongTien = ds.TongThanhToan
                })
                .ToList();

            var data = chiTiet
                .GroupBy(x => new { x.MaChuSan, x.TenChuSan })
                .Select(g => new
                {
                    TenChuSan = g.Key.TenChuSan,
                    TongTien = g.Sum(x => x.TongTien)
                })
                .OrderByDescending(x => x.TongTien)
                .ToList();

            decimal tongTatCa = chiTiet.Sum(x => x.TongTien);

            return Json(new
            {
                ChiTiet = data,
                TongTatCa = tongTatCa
            });
        }

        public IActionResult DoanhThuTheoThang()
        {
            var lichSu = _db.LichSus
                .Where(ls => ls.ThoiGian.HasValue) // Chỉ lấy bản ghi có thời gian thanh toán
                .Select(ls => new
                {
                    Thang = ls.ThoiGian.Value.Month,
                    TongTien = ls.TongThanhToan
                })
                .ToList();

            var data = lichSu
                .GroupBy(x => x.Thang)
                .Select(g => new
                {
                    Thang = g.Key,
                    TongTien = g.Sum(x => x.TongTien)
                })
                .OrderBy(x => x.Thang)
                .ToList();

            return Json(data);
        }



    }
}
