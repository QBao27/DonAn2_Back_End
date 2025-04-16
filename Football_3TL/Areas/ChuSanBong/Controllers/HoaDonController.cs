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
            //var maChuSan = HttpContext.Session.GetInt32("maChuSan");
            int? maChuSan = 1;

            if (maChuSan == null)
            {
                return Json(new { error = "Không tìm thấy MaChuSan trong session." });
            }

            var danhSachHoaDon = dbContext.HoaDons
                .Include(h => h.MaDatSanNavigation)
                    .ThenInclude(t => t.MaKhachHangNavigation)
                .Include(h => h.MaDatSanNavigation.MaSanNavigation)
                .Where(h => h.MaDatSanNavigation.MaChuSan == maChuSan)
                .Select(h => new
                {
                    MaHoaDon = "HD" + h.MaHoaDon,
                    TenSan = h.MaDatSanNavigation.MaSanNavigation != null
                                ? h.MaDatSanNavigation.MaSanNavigation.TenSan
                                : "Chưa có",
                    TenKhachHang = h.MaDatSanNavigation.MaKhachHangNavigation != null
                                ? h.MaDatSanNavigation.MaKhachHangNavigation.HoVaTen
                                : "Chưa có",
                    ThoiGianDatSan = h.MaDatSanNavigation.NgayDat.HasValue && h.MaDatSanNavigation.GioDat.HasValue
                                ? h.MaDatSanNavigation.NgayDat.Value.ToString("dd/MM/yyyy")
                                : "Chưa có",
                    TongGiaTri = (h.MaDatSanNavigation.MaSanNavigation != null && h.MaDatSanNavigation.ThoiLuong.HasValue)
                                ? $"{((double)(h.MaDatSanNavigation.MaSanNavigation.Gia * (h.MaDatSanNavigation.ThoiLuong.Value / 60.0))).ToString("N0")} VND"
                                : "Chưa có",
                    ThoiGianLapHoaDon = h.ThoiGian.HasValue
                                ? h.ThoiGian.Value.ToString("dd/MM/yyyy")
                                : "Chưa có"
                })
                .ToList();

            // In thông tin ra terminal (Output console)
            Console.WriteLine("Danh sách hóa đơn:");
            foreach (var hoaDon in danhSachHoaDon)
            {
                Console.WriteLine($"Mã Hóa Đơn: {hoaDon.MaHoaDon}, Tên Sân: {hoaDon.TenSan}, Tên Khách Hàng: {hoaDon.TenKhachHang}, Thời Gian Đặt Sân: {hoaDon.ThoiGianDatSan}, Tổng Giá Trị: {hoaDon.TongGiaTri}, Thời Gian Lập Hóa Đơn: {hoaDon.ThoiGianLapHoaDon}");
            }

            return Json(danhSachHoaDon);
        }



    }
}
