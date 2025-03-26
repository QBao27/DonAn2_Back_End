using Football_3TL.Areas.KhachHang.Models;
using Football_3TL.Controllers.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.IdentityModel.Tokens;

namespace Football_3TL.Areas.KhachHang.Controllers
{
    [Area("KhachHang")]
    public class AccountController : Controller
    {
        //thay thế cho database
        private readonly Football3tlContext _db;
        //tạo logger để ghi log để dễ kiểm tra lỗi
        private readonly ILogger<AccountController> _log;

        //tạo contructor 
        public AccountController(Football3tlContext db, ILogger<AccountController> log)
        {
            _db = db;
            _log = log; 
        }

        //Hàm đăng ký
        [HttpPost] //dùng formbody khi gửi dữ liệu bằng json or ajax chứ k phải trong from
        public async Task<IActionResult> SignUp([FromBody] modelSignUp model) 
        {
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Dữ liệu không hợp lệ" });
                }

                if(string.IsNullOrEmpty(model.FullName) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Phone) || string.IsNullOrEmpty(model.))
                
            }
            catch (Exception)
            {

            }
        }

        
    }
}
