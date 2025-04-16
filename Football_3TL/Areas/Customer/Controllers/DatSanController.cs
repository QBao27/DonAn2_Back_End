using Microsoft.AspNetCore.Mvc;

namespace Football_3TL.Areas.Customer.Controllers
{
    [Area("Customer")]
    public class DatSanController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
