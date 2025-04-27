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
        public async Task<IActionResult> getDanhSachSan()
        {
            try
            {
                var thongTins = await _db.ThongTinBaiDangs.ToListAsync();
                return Json(new { success = true });
            }
            catch (Exception)
            {

                return Json(new { success = false, message = "Lỗi server!" });
            }
        }
    }
}
