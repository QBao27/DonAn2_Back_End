using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    public class KhuyenMaiController : Controller
    {
        //thay thế cho database
        private readonly Football3tlContext _db;
        //tạo logger để ghi log để dễ kiểm tra lỗi
        private readonly ILogger<KhuyenMaiController> _log;

        //tạo contructor 
        public KhuyenMaiController(Football3tlContext db, ILogger<KhuyenMaiController> log)
        {
            _db = db;
            _log = log;
        }

        public IActionResult Index()
        {
            return View();
        }

        //API hiển thị danh sách khuyến mãi
        [HttpGet]
        public async Task<IActionResult> GetAllKhuyenMai()
        {
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");
            if (!maChuSan.HasValue)
            {
                _log.LogError("maChuSan is null. Session might not be set.");
                return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
            }
            try
            {
                var danhSachKhuyenMai = await _db.KhuyenMais
                    .Select(g => new
                    {
                        g.TenKm,
                        g.GiamGia,
                        g.MaKm,
                        g.NgayBd,
                        g.NgayKt,
                        g.TrangThai
                    })
                    .ToListAsync();
                return Json(new { success = true, data = danhSachKhuyenMai });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi lấy danh sách khuyến mãi");
                return Json(new { success = false, message = "Lỗi khi lấy danh sách Khuyến mãi" });
            }
        }

        //API hiển thị data lên modal sửa 
        [HttpGet]
        public async Task<IActionResult> GetKhuyenMaiById(int id)
        {
            try
            {
                var khuyenMai = await _db.KhuyenMais
               .Where(g => g.MaKm == id)
               .Select(g => new
               {
                   g.TenKm,
                   g.GiamGia,
                   g.MaKm,
                   g.NgayBd,
                   g.NgayKt,
                   g.TrangThai
               })
               .FirstOrDefaultAsync();

                if (khuyenMai == null)
                    return Json(new { success = false, message = "Không tìm thấy chương trình" });

                return Json(new { success = true, data = khuyenMai });
            }
            catch (Exception)
            {

                return Json(new { success = false, message = "Lỗi server!" });

            }

        }

        //API thêm
        [HttpPost]
        public async Task<IActionResult> AddKhuyenMai([FromBody] KhuyenMai km)
        {
            try
            {
                if (km == null)
                {
                    return Json(new { success = false, message = "Dữ liệu khuyến mãi không hợp lệ!" });
                }

                // Kiểm tra tên khuyến mãi
                if (string.IsNullOrWhiteSpace(km.TenKm))
                {
                    return Json(new { success = false, message = "Tên khuyến mãi không được để trống!" });
                }

                // Kiểm tra giảm giá > 0 và <= 100 (%)
                if (km.GiamGia <= 0 || km.GiamGia > 100)
                {
                    return Json(new { success = false, message = "Giảm giá phải lớn hơn 0 và nhỏ hơn hoặc bằng 100!" });
                }

                // Kiểm tra ngày bắt đầu và kết thúc hợp lệ
                if (km.NgayBd == default || km.NgayKt == default)
                {
                    return Json(new { success = false, message = "Ngày bắt đầu và ngày kết thúc không được để trống!" });
                }

                if (km.NgayBd > km.NgayKt)
                {
                    return Json(new { success = false, message = "Ngày bắt đầu không được lớn hơn ngày kết thúc!" });
                }

                if (km.NgayKt < DateOnly.FromDateTime(DateTime.Today))
                {
                    return Json(new { success = false, message = "Ngày kết thúc không được nhỏ hơn ngày hôm nay!" });
                }

                // ✅ Kiểm tra giao thời gian: không được trùng với khuyến mãi khác
                bool isOverlapping = await _db.KhuyenMais
                    .AnyAsync(k =>
                        (km.NgayBd <= k.NgayKt && km.NgayKt >= k.NgayBd)
                    );

                if (isOverlapping)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Tại một thời điểm chỉ được phép có 1 chương trình khuyến mãi diễn ra!"
                    });
                }

                // 👉 Thiết lập trạng thái khuyến mãi dựa trên ngày hiện tại
                var today = DateOnly.FromDateTime(DateTime.Today);

                if (today < km.NgayBd)
                {
                    km.TrangThai = "Chưa diễn ra";
                }
                else if (today > km.NgayKt)
                {
                    km.TrangThai = "Đã kết thúc";
                }
                else
                {
                    km.TrangThai = "Đang diễn ra";
                }

                _db.KhuyenMais.Add(km);
                await _db.SaveChangesAsync();

                return Json(new { success = true, message = "Thêm khuyến mãi thành công!" });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi thêm khuyến mãi");
                return Json(new { success = false, message = "Lỗi khi thêm khuyến mãi! " + ex.Message });
            }
        }


        //API sửa 
        [HttpPost]
        public async Task<IActionResult> UpdateKhuyenMai([FromBody] KhuyenMai km)
        {
            try
            {
                if (km == null)
                {
                    return Json(new { success = false, message = "Dữ liệu khuyến mãi không hợp lệ!" });
                }

                // Kiểm tra tên khuyến mãi
                if (string.IsNullOrWhiteSpace(km.TenKm))
                {
                    return Json(new { success = false, message = "Tên khuyến mãi không được để trống!" });
                }

                // Kiểm tra giảm giá hợp lệ
                if (km.GiamGia <= 0 || km.GiamGia > 100)
                {
                    return Json(new { success = false, message = "Giảm giá phải lớn hơn 0 và nhỏ hơn hoặc bằng 100!" });
                }

                // Kiểm tra ngày bắt đầu và kết thúc
                if (km.NgayBd == default || km.NgayKt == default)
                {
                    return Json(new { success = false, message = "Ngày bắt đầu và kết thúc không được để trống!" });
                }

                if (km.NgayBd > km.NgayKt)
                {
                    return Json(new { success = false, message = "Ngày bắt đầu không được lớn hơn ngày kết thúc!" });
                }

                if (km.NgayKt < DateOnly.FromDateTime(DateTime.Today))
                {
                    return Json(new { success = false, message = "Ngày kết thúc không được nhỏ hơn ngày hôm nay!" });
                }

                // Tìm khuyến mãi cần cập nhật
                var existingKM = await _db.KhuyenMais.FindAsync(km.MaKm);
                if (existingKM == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy khuyến mãi để cập nhật!" });
                }

                var today1 = DateOnly.FromDateTime(DateTime.Today);
                if (existingKM.TrangThai == "Đang diễn ra")
                {
                    return Json(new
                    {
                        success = false,
                        message = "Không thể sửa: khuyến mãi đang diễn ra!"
                    });
                }

                // Kiểm tra ngày có giao nhau với chương trình khác không
                bool isOverlapping = await _db.KhuyenMais
                    .Where(k => k.MaKm != km.MaKm) // loại trừ chính nó
                    .AnyAsync(k =>
                        (km.NgayBd <= k.NgayKt && km.NgayKt >= k.NgayBd)
                    );

                if (isOverlapping)
                {
                    return Json(new { success = false, message = "Khoảng thời gian khuyến mãi bị trùng với chương trình khác!" });
                }

               
                // Cập nhật trạng thái theo ngày hiện tại
                var today = DateOnly.FromDateTime(DateTime.Today);
                if (today < km.NgayBd)
                    existingKM.TrangThai = "Chưa diễn ra";
                else if (today > km.NgayKt)
                    existingKM.TrangThai = "Đã kết thúc";
                else
                    existingKM.TrangThai = "Đang diễn ra";

                // Gán các thuộc tính mới
                existingKM.TenKm = km.TenKm;
                existingKM.GiamGia = km.GiamGia;
                existingKM.NgayBd = km.NgayBd;
                existingKM.NgayKt = km.NgayKt;

                _db.KhuyenMais.Update(existingKM);
                await _db.SaveChangesAsync();

                return Json(new { success = true, message = "Cập nhật khuyến mãi thành công!" });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi cập nhật khuyến mãi");
                return Json(new { success = false, message = "Lỗi khi cập nhật khuyến mãi! " + ex.Message });
            }
        }


        //API xóa gói
        [HttpPost]
        public async Task<IActionResult> DeleteKhuyenMai(int id)
        {
            try
            {
                var khuyenMai = await _db.KhuyenMais.FindAsync(id);
                if (khuyenMai == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy khuyến mãi cần xóa!" });
                }

                // Kiểm tra trạng thái khuyến mãi: nếu đang hoạt động thì không được xóa
                var today = DateOnly.FromDateTime(DateTime.Today);
                if (khuyenMai.NgayBd <= today && today <= khuyenMai.NgayKt)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Không thể xóa: khuyến mãi đang diễn ra!"
                    });
                }

                _db.KhuyenMais.Remove(khuyenMai);
                await _db.SaveChangesAsync();

                return Json(new { success = true, message = "Xóa khuyến mãi thành công!" });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi xóa khuyến mãi");
                return Json(new { success = false, message = "Lỗi khi xóa khuyến mãi: " + ex.Message });
            }
        }

        //API thay đổi trạng thái khuyến mãi
        [HttpPost]
        public async Task<IActionResult> ChangeStatusAllKhuyenMai()
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.Today);
                // Lấy toàn bộ khuyến mãi
                var listKm = await _db.KhuyenMais.ToListAsync();

                foreach (var km in listKm)
                {
                    string newStatus;
                    if (today < km.NgayBd)
                        newStatus = "Chưa diễn ra";
                    else if (today > km.NgayKt)
                        newStatus = "Đã kết thúc";
                    else
                        newStatus = "Đang diễn ra";

                    // Chỉ gán khi có sự khác biệt
                    if (!string.Equals(km.TrangThai, newStatus, StringComparison.OrdinalIgnoreCase))
                    {
                        km.TrangThai = newStatus;
                        _db.KhuyenMais.Update(km);
                    }
                }

                await _db.SaveChangesAsync();
                return Json(new { success = true, message = "Đã cập nhật trạng thái cho tất cả khuyến mãi." });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi cập nhật trạng thái tất cả khuyến mãi");
                return Json(new { success = false, message = "Lỗi khi cập nhật trạng thái: " + ex.Message });
            }
        }

    }
}
