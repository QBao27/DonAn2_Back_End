using Football_3TL.Areas.ChuSanBong.Models;
using Football_3TL.Data;
using Football_3TL.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    [CheckGoiHetHan]
    [CheckGoiHetHan]
    public class QuanLySanController : Controller
    {
        private readonly Football3tlContext dbContext;
        public QuanLySanController(Football3tlContext dbContext) 
        {
            this.dbContext = dbContext;
        }

        
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetSanBong()
        {
            // Lấy MaChuSan từ Session
            // int? maChuSan = HttpContext.Session.GetInt32("MaChuSan");
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");

            //int maChuSan = 1;
            if (maChuSan == null)
            {
                return Json(new { error = "Chưa đăng nhập hoặc không có quyền truy cập." });
            }

            // Lấy danh sách sân bóng của chủ sân hiện tại
            var sanBongList = await dbContext.SanBongs
                .Where(s => s.MaChuSan == maChuSan)
                .Select(s => new
                {
                    s.MaSan,
                    s.TenSan,
                    s.LoaiSan,
                    Gia = s.Gia.HasValue ? s.Gia.Value.ToString("#,##0") : "0"
                })
                .ToListAsync();

            return Json(sanBongList);
        }



        [HttpPost]
        public async Task<IActionResult> ThemSanBong([FromBody] SanBongModel model)
        {
            if (string.IsNullOrEmpty(model.TenSan) || model.Gia <= 0 || string.IsNullOrEmpty(model.LoaiSan))
            {
                return Json(new { success = false, message = "Vui lòng nhập đầy đủ thông tin." });
            }

            //int maChuSan = 1; // Sau này lấy từ Session
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");

            // Kiểm tra sân đã tồn tại chưa
            var sanBongTonTai = await dbContext.SanBongs
                .AnyAsync(s => s.TenSan == model.TenSan && s.MaChuSan == maChuSan);

            if (sanBongTonTai)
            {
                return Json(new { success = false, message = "Tên sân đã tồn tại. Vui lòng chọn tên khác!" });
            }

            var sanBong = new SanBong
            {
                TenSan = model.TenSan,
                Gia = model.Gia,
                LoaiSan = model.LoaiSan,
                MaChuSan = maChuSan
            };

            dbContext.SanBongs.Add(sanBong);
            await dbContext.SaveChangesAsync();

            return Json(new { success = true, message = "Thêm sân thành công!", data = sanBong });
        }


        [HttpPost]
        public async Task<IActionResult> SuaSanBong([FromBody] SanBongModel model)
        {
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");
            try
            {
                if (model.MaSan <= 0 || string.IsNullOrEmpty(model.TenSan) || model.Gia <= 0 || string.IsNullOrEmpty(model.LoaiSan))
                {
                    return Json(new { success = false, message = "Vui lòng nhập đầy đủ thông tin." });
                }

                var sanBong = await dbContext.SanBongs.FindAsync(model.MaSan);
                if (sanBong == null)
                {
                    return Json(new { success = false, message = "Sân bóng không tồn tại." });
                }

                // Kiểm tra tên sân có trùng không (trừ chính nó)
                bool isDuplicate = dbContext.SanBongs.Any(s => s.TenSan == model.TenSan && s.MaSan != model.MaSan && s.MaChuSan == maChuSan);
                if (isDuplicate)
                {
                    return Json(new { success = false, message = "Tên sân đã tồn tại. Vui lòng chọn tên khác." });
                }

                // 1. Lọc xuống chỉ các booking của sân cần sửa
                var bookings = dbContext.ThongTinDatSans
                    .Where(d => d.MaSan == model.MaSan);

                // 2. Kiểm tra tất cả booking có trạng thái "Trống" hoặc "Hết giờ"
                bool canEdit = await bookings
                    .AllAsync(d =>
                        string.Equals(d.TrangThaiSan, "Trống")
                        || string.Equals(d.TrangThaiSan, "Hết giờ")
                    );

                // 3. Nếu có ít nhất một booking không thỏa, chặn sửa
                if (!canEdit)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Không thể sửa sân vì còn lượt đặt hoặc chưa hết giờ!"
                    });
                }


                // Cập nhật thông tin sân
                sanBong.TenSan = model.TenSan;
                sanBong.Gia = model.Gia;
                sanBong.LoaiSan = model.LoaiSan;

                await dbContext.SaveChangesAsync();

                return Json(new { success = true, message = "Cập nhật sân thành công!", data = sanBong });
            }
            catch 
            {
                return Json(new { success = false, message = "Không thể sửa sân này vì nó đang hoạt động!" });
            }
            
        }

        [HttpGet]
        public async Task<IActionResult> ChiTietSanBong(int id)
        {
            var san = await dbContext.SanBongs.FindAsync(id);
            if (san == null)
            {
                return Json(null);
            }
            return Json(san);
        }


        [HttpPost]
        public async Task<IActionResult> XoaSanBong(int maSan)
        {
            try
            {
                var sanBong = await dbContext.SanBongs.FindAsync(maSan);
                if (sanBong == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy sân bóng!" });
                }

                dbContext.SanBongs.Remove(sanBong);
                await dbContext.SaveChangesAsync();

                return Json(new { success = true, message = "Xóa sân bóng thành công!" });
            }
            catch 
            {
                return Json(new { success = false, message = "Không thể xóa sân này vì nó đang hoạt động!" });
            }
           
        }
    }
}
