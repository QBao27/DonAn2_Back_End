using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    public class GoiDangKyController : Controller
    {
        private readonly Football3tlContext dbContext;

        public GoiDangKyController(Football3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllGoiDangKy()
        {
            var goiDangKyList = await dbContext.GoiDangKies
                .OrderBy(g => g.ThoiHan)
                .Select(g => new {
                    MaGoi = g.MaGoi,
                    ThoiHan = g.ThoiHan,
                    Gia = g.Gia
                })
                .ToListAsync();

            return Json(goiDangKyList);
        }
    }
}
