using Football_3TL.Areas.Customer.Models;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.Customer.Controllers
{
    [Area("Customer")]
    public class HomeController : Controller
    {
        //thay thế cho database
        private readonly Football3tlContext _db;
        //tạo logger để ghi log để dễ kiểm tra lỗi
        private readonly ILogger<HomeController> _log;

        //tạo contructor 
        public HomeController(Football3tlContext db, ILogger<HomeController> log)
        {
            _db = db;
            _log = log;
        }

        public IActionResult Index()
        {
            return View();
        }

        //API lấy danh sách sân bóng
        [HttpGet]
        public async Task<IActionResult> getDanhSachSan()
        {
            try
            {
                var list = await _db.ChuSans
                 .AsNoTracking()
                 .Include(c => c.ThongTinBaiDangs)
                 .Include(c => c.SanBongs)
                 .Select(c => new modelDanhSachSanBong
                 {
                     MaChuSan = c.MaChuSan,
                     TenSanBong = c.TenSanBong,
                     Huyen = c.Huyen,
                     Tinh = c.Tinh,
                     MaBaiDang = c.ThongTinBaiDangs.Select(b => b.MaBaiDang).FirstOrDefault(),
                     SoSanBong = c.SanBongs.Count(),
                     AnhBaiDang = c.ThongTinBaiDangs
                          .SelectMany(b => b.HinhAnhBaiDangs)
                          .Where(img => img.ThuTu == 1)
                          .Select(img => img.HinhAnh)
                          .FirstOrDefault()
                 })
                 .ToListAsync();
                return Json(new { success = true, data = list });
            }
            catch (Exception)
            {

                return Json(new { success = false, message = "Lỗi server!" });
            }
        }
    }
}
