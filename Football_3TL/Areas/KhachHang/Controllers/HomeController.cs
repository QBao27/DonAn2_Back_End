using Microsoft.AspNetCore.Mvc;

namespace Football_3TL.Areas.KhachHang.Controllers
{
    [Area("KhachHang")]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
