using Microsoft.AspNetCore.Mvc;

namespace Football_3TL.Areas.ChuSan.Controllers
{
    [Area("ChuSan")]
    public class HoaDonController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
