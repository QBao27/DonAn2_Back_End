using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Controllers
{
    public class HomeController1 : Controller
    {
        private readonly Football3tlContext dbContext;

        public HomeController1(Football3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public IActionResult Index()
        {
            var danhSachChuSan = dbContext.ChuSans.ToList();
            Console.WriteLine(danhSachChuSan.Count);
            return View(danhSachChuSan);
        }
    }
}
