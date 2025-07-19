using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Services
{
    public class CheckGoiHetHanAttribute : ActionFilterAttribute
    {
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var db = context.HttpContext.RequestServices.GetService<Football3tlContext>();
            var session = context.HttpContext.Session;

            var maChuSan = session.GetInt32("maChuSan");
            Console.WriteLine($"[Filter] maChuSan = {maChuSan}");

            if (maChuSan == null)
            {
                context.Result = new RedirectToActionResult("Login", "Account", null);
                return;
            }

            var now = DateTime.Now;

            var dangKy = await db.ThongTinDangKies
                .Where(x => x.MaChuSan == maChuSan && x.TrangThai == "1")
                .OrderByDescending(x => x.NgayKt)
                .FirstOrDefaultAsync();

            Console.WriteLine($"[Filter] DangKy: {dangKy?.MaDangKy}, TrangThai: {dangKy?.TrangThai}, NgayKT: {dangKy?.NgayKt:yyyy-MM-dd HH:mm:ss.fff}");

            if (dangKy == null || dangKy.NgayKt < now)
            {
                var isAjax = context.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest";
                Console.WriteLine($"[Filter] isAjax = {isAjax}");

                if (isAjax)
                {
                    context.Result = new JsonResult(new
                    {
                        expired = true,
                        message = "Hết hạn!"
                    });
                }
                else
                {
                    context.Result = new RedirectToActionResult("Index", "ThongBao", new { area = "ChuSanBong" });
                }

                return;
            }

            await next();
        }


    }
}
