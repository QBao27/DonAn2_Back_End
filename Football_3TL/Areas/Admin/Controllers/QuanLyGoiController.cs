using Football_3TL.Areas.ChuSanBong.Controllers;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class QuanLyGoiController : Controller
    {
        //thay thế cho database
        private readonly Football3tlContext _db;
        //tạo logger để ghi log để dễ kiểm tra lỗi
        private readonly ILogger<QuanLyGoiController> _log;

        public QuanLyGoiController(Football3tlContext db, ILogger<QuanLyGoiController> log)
        {
            _db = db;
            _log = log;
        }

        public IActionResult Index()
        {
            return View();
        }

        //API hiển thị danh sách gói
        [HttpGet]
        public async Task<IActionResult> GetAllGoi()
        {
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");
            if (!maChuSan.HasValue)
            {
                _log.LogError("maChuSan is null. Session might not be set.");
                return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
            }
            try
            {
                var danhSachGoi = await _db.GoiDangKies
                    .Select(g => new
                    {
                        g.MaGoi,
                        g.ThoiHan,
                        g.Gia
                    })
                    .ToListAsync();
                Console.WriteLine("Danh sách gói: " + danhSachGoi.Count);
                return Json(new { success = true, data = danhSachGoi });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi lấy danh sách gói");
                return Json(new { success = false, message = "Lỗi khi lấy danh sách gói" });
            }
        }

        //API hiển thị data lên modal sửa 
        [HttpGet]
        public async Task<IActionResult> GetGoiById(int id)
        {
            try
            {
                var goi = await _db.GoiDangKies
               .Where(g => g.MaGoi == id)
               .Select(g => new {
                   g.MaGoi,
                   g.ThoiHan,
                   g.Gia
               })
               .FirstOrDefaultAsync();

                if (goi == null)
                    return Json(new { success = false, message = "Không tìm thấy gói" });

                return Json(new { success = true, data = goi });
            }
            catch (Exception)
            {

                return Json(new { success = false, message = "Lỗi server!"});

            }

        }

        //API thêm gói
        [HttpPost]
        public async Task<IActionResult> AddGoi([FromBody] GoiDangKy goi)
        {
            if (goi == null || goi.ThoiHan <= 0 || goi.Gia <= 0)
            {
                return Json(new { success = false, message = "Thông tin gói không hợp lệ!" });
            }
            try
            {
                _db.GoiDangKies.Add(goi);
                await _db.SaveChangesAsync();
                return Json(new { success = true, message = "Thêm gói thành công!" });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi thêm gói");
                return Json(new { success = false, message = "Lỗi khi thêm gói" });
            }
        }

        //API sửa gói
        [HttpPost]
        public async Task<IActionResult> UpdateGoi([FromBody] GoiDangKy goi)
        {
            if (goi == null || goi.ThoiHan <= 0 || goi.Gia <= 0)
            {
                return Json(new { success = false, message = "Thông tin gói không hợp lệ!" });
            }
            try
            {
                var existingGoi = await _db.GoiDangKies.FindAsync(goi.MaGoi);
                if (existingGoi == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy gói" });
                }

                // 1. Kiểm tra xem có bản ghi ThongTinDangKy nào đang dùng MaGoi này không
                bool isUsedInDangKy = await _db.ThongTinDangKies
                    .AnyAsync(dk => dk.MaGoi == goi.MaGoi);
                if (isUsedInDangKy)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Không thể sửa: gói này đang được sử dụng."
                    });
                }
                existingGoi.ThoiHan = goi.ThoiHan;
                existingGoi.Gia = goi.Gia;
                _db.GoiDangKies.Update(existingGoi);
                await _db.SaveChangesAsync();
                return Json(new { success = true, message = "Cập nhật gói thành công!" });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi cập nhật gói");
                return Json(new { success = false, message = "Lỗi khi cập nhật gói" });
            }
        }

        //API xóa gói
        [HttpPost]
        public async Task<IActionResult> DeleteGoi(int id)
        {
            try
            {
                // 1. Kiểm tra xem có bản ghi ThongTinDangKy nào đang dùng MaGoi này không
                bool isUsedInDangKy = await _db.ThongTinDangKies
                    .AnyAsync(dk => dk.MaGoi == id);
                if (isUsedInDangKy)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Không thể xóa: gói này đang được sử dụng."
                    });
                }

                var goi = await _db.GoiDangKies.FindAsync(id);
                if (goi == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy gói" });
                }
                _db.GoiDangKies.Remove(goi);
                await _db.SaveChangesAsync();
                return Json(new { success = true, message = "Xóa gói thành công!" });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi xóa gói");
                return Json(new { success = false, message = "Lỗi khi xóa gói" });
            }
        }
    }
}
