using Microsoft.AspNetCore.Mvc;

namespace Football_3TL.Areas.ChuSan.Controllers
{
    [Area("ChuSan")]
    public class QuanLySanController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
