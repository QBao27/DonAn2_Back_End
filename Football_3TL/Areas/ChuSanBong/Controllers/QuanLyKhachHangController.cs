using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    public class QuanLyKhachHangController : Controller
    {
        private readonly Football3tlContext dbContext;
        public QuanLyKhachHangController(Football3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult DanhSachKhachHang()
        {
            // Lấy MaChuSan từ Session
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");

            //int maChuSan = 1;
            if (maChuSan == null)
            {
                return Unauthorized(); // Nếu chưa đăng nhập, trả về lỗi 401
            }

            // Lọc danh sách đặt sân theo MaChuSan
            var danhSachDatSan = dbContext.ThongTinDatSans
                .Include(d => d.MaKhachHangNavigation) // Lấy thông tin khách hàng
                .Include(d => d.MaSanNavigation) // Lấy thông tin sân bóng
                .Where(d => d.MaChuSan == maChuSan) // Chỉ lấy dữ liệu của chủ sân hiện tại
                .Select(d => new
                {
                    NgayDat = d.NgayDat.HasValue ? d.NgayDat.Value.ToString("dd/MM/yyyy") : "Chưa có",
                    TenNguoiDat = d.MaKhachHangNavigation != null ? d.MaKhachHangNavigation.HoVaTen : "Chưa có",
                    SoDienThoai = d.MaKhachHangNavigation != null ? d.MaKhachHangNavigation.SoDienThoai : "Chưa có",
                    TenSan = d.MaSanNavigation != null ? d.MaSanNavigation.TenSan : "Chưa có",
                    TrangThai = !string.IsNullOrEmpty(d.TrangThaiThanhToan) ? d.TrangThaiThanhToan : "Chưa có",
                    ThanhToan = (d.MaSanNavigation != null && d.ThoiLuong.HasValue)
                                ? $"{((double)(d.MaSanNavigation.Gia * (d.ThoiLuong.Value / 60.0))).ToString("N0")} VND"
                                : "Chưa có"
    
                }).ToList();

            return Json(danhSachDatSan);
        }

    }
}
