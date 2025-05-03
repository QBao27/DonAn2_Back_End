using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class QuanLyTaiKhoanController : Controller
    {
        private readonly Football3tlContext dbContext;
        public QuanLyTaiKhoanController(Football3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetAllChuSan()
        {
            var danhSach = dbContext.ChuSans
            .Select(cs => new
            {
               cs.MaChuSan,
               cs.HoVaTen,
               cs.TenSanBong,
               cs.SoDienThoai,
               cs.Email,
               TrangThai = cs.TaiKhoans.FirstOrDefault().TrangThai // lấy tài khoản đầu tiên nếu có
             })
             .Skip(1)
             .ToList();
            return Json(danhSach);
        }

        [HttpGet]
        public IActionResult GetChuSanById(int id)
        {
            var cs = dbContext.ChuSans
                .Where(x => x.MaChuSan == id)
                .Select(x => new
                {
                    hoVaTen = x.HoVaTen,
                    soDienThoai = x.SoDienThoai,
                    email = x.Email,
                    tenSanBong = x.TenSanBong,
                    diaChi = x.DiaChi,
                    xa = x.Xa,
                    huyen = x.Huyen,
                    tinh = x.Tinh
                })
                .FirstOrDefault();

            if (cs == null)
                return NotFound();

            return Json(cs);
        }

        [HttpPost]
        public IActionResult MoTaiKhoan(int maChuSan)
        {
            var taiKhoan = dbContext.TaiKhoans
                .FirstOrDefault(tk => tk.MaChuSan == maChuSan);

            if (taiKhoan == null)
            {
                return Json(new { success = false, message = "Không tìm thấy tài khoản!" });
            }

            taiKhoan.TrangThai = "2";
            dbContext.SaveChanges();

            return Json(new { success = true, message = "Mở tài khoản thành công!" });
        }

        [HttpPost]
        public IActionResult KhoaTaiKhoan(int maChuSan)
        {
            var taiKhoan = dbContext.TaiKhoans
                .FirstOrDefault(tk => tk.MaChuSan == maChuSan);

            if (taiKhoan == null)
            {
                return Json(new { success = false, message = "Không tìm thấy tài khoản!" });
            }

            taiKhoan.TrangThai = "1";
            dbContext.SaveChanges();

            return Json(new { success = true, message = "Khóa tài khoản thành công!" });
        }


    }
}
