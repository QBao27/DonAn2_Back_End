using Microsoft.AspNetCore.Mvc;

namespace Football_3TL.Areas.Admin.Controllers
{
    public class QuanLyGoiController : Controller
    {
        [Area("Admin")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
