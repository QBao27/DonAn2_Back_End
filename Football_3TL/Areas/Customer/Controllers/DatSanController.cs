using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.Customer.Controllers
{
    [Area("Customer")]
    public class DatSanController : Controller
    {
        private readonly Football3tlContext dbContext;
        public DatSanController(Football3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetGioMoCua(int maChuSan)
        {
            var thongTin = dbContext.ThongTinBaiDangs
                .FirstOrDefault(x => x.MaChuSan == maChuSan);

            if (thongTin == null)
                return NotFound();

            return Json(new
            {
                gioMoCua = thongTin.GioMoCua,
                gioDongCua = thongTin.GioDongCua
            });
        }
    }
}
