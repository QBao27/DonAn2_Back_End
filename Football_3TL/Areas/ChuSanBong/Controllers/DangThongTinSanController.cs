using Microsoft.AspNetCore.Mvc;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    public class DangThongTinSanController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
