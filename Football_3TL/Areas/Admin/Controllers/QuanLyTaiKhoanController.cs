using Microsoft.AspNetCore.Mvc;

namespace Football_3TL.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class QuanLyTaiKhoanController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
