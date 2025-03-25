using Microsoft.AspNetCore.Mvc;

namespace Football_3TL.Areas.ChuSan.Controllers
{
    [Area("ChuSan")]
    public class QuanLyDatSanController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
