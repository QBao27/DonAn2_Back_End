using Football_3TL.Data;
using Football_3TL.Models;
using Football_3TL.Services;
using Microsoft.AspNetCore.Mvc;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    [CheckGoiHetHan]
    public class GiaKhuyenMaiController : Controller
    {
        private readonly Football3tlContext _context;

        public GiaKhuyenMaiController(Football3tlContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetGioMoVaDongCua()
        {
            int? maChuSan = HttpContext.Session.GetInt32("maChuSan");
            Console.WriteLine($"[LOG] MaChuSan: {maChuSan}");

            if (maChuSan == null)
            {
                Console.WriteLine("[LOG] MaChuSan không tồn tại trong session.");
                return Json(new { success = false, message = "Chưa đăng nhập" });
            }

            var baiDang = _context.ThongTinBaiDangs
                                  .FirstOrDefault(b => b.MaChuSan == maChuSan);

            if (baiDang == null)
            {
                Console.WriteLine($"[LOG] Không tìm thấy bài đăng cho MaChuSan = {maChuSan}");
                return Json(new { success = false, message = "Không tìm thấy bài đăng" });
            }

            Console.WriteLine($"[LOG] Tìm thấy bài đăng: GioMoCua = {baiDang.GioMoCua}, GioDongCua = {baiDang.GioDongCua}");

            return Json(new
            {
                success = true,
                GioMoCua = baiDang.GioMoCua ?? 0,
                GioDongCua = baiDang.GioDongCua ?? 0
            });
        }


        [HttpPost]
        public IActionResult ThemMoi([FromBody] GiamGiaTheoGioVM model)
        {
            if (model == null)
                return Json(new { success = false, message = "Model NULL!" });

            int? maChuSan = HttpContext.Session.GetInt32("maChuSan");
            if (maChuSan == null)
                return Json(new { success = false, message = "Chưa đăng nhập." });

            if (model.GioBd >= model.GioKt)
                return Json(new { success = false, message = "Giờ bắt đầu phải nhỏ hơn giờ kết thúc!" });

            if (model.GiamGia <= 0 || model.GiamGia > 80)
                return Json(new { success = false, message = "Phần trăm giảm giá không hợp lệ!" });

            // ✅ Lấy các KM cũ
            var khuyenMais = _context.GiamGiaTheoGios
                .Where(x => x.MaChuSan == maChuSan)
                .ToList();

            // ✅ Kiểm tra trùng giờ
            foreach (var km in khuyenMais)
            {
                if (!(model.GioKt <= km.GioBd || km.GioKt <= model.GioBd))
                {
                    return Json(new
                    {
                        success = false,
                        message = $"Khung giờ bị trùng với [{km.GioBd} - {km.GioKt}]"
                    });
                }
            }

            var newKM = new GiamGiaTheoGio
            {
                MaChuSan = maChuSan.Value,
                GiamGia = model.GiamGia,
                GioBd = model.GioBd,
                GioKt = model.GioKt
            };

            _context.GiamGiaTheoGios.Add(newKM);
            _context.SaveChanges();

            return Json(new { success = true, message = "Thêm thành công!" });
        }

        [HttpGet]
        public IActionResult LayTatCa()
        {
            int? maChuSan = HttpContext.Session.GetInt32("maChuSan");
            if (maChuSan == null)
                return Json(new { success = false, message = "Chưa đăng nhập!" });

            var now = TimeOnly.FromDateTime(DateTime.Now);

            var danhSach = _context.GiamGiaTheoGios
                .Where(x => x.MaChuSan == maChuSan)
                .ToList() // ✅ ToList() trước để EF chạy SQL xong rồi mới ToString()
                .Select(x => new
                {
                    MaGiamGia = x.MaGiamGia,
                    GioBd = x.GioBd.ToString("HH:mm"),
                    GioKt = x.GioKt.ToString("HH:mm"),
                    GiamGia = x.GiamGia,
                    TrangThai = (now >= x.GioBd && now < x.GioKt) ? "Đang áp dụng" : "Chưa áp dụng"
                })
                .OrderBy(x => x.GioBd)
                .ToList();

            return Json(new { success = true, data = danhSach });
        }

        [HttpGet]
        public IActionResult GetById(int id)
        {
            var km = _context.GiamGiaTheoGios.FirstOrDefault(x => x.MaGiamGia == id);

            if (km == null)
            {
                return Json(new { success = false, message = "Không tìm thấy dữ liệu!" });
            }

            return Json(new
            {
                success = true,
                data = new
                {
                    maGiamGia = km.MaGiamGia,
                    gioBd = km.GioBd.ToString("HH:mm:ss"),
                    gioKt = km.GioKt.ToString("HH:mm:ss"),
                    giamGia = km.GiamGia
                }
            });
        }


        [HttpPost]
        public IActionResult CapNhat([FromBody] GiamGiaTheoGioVM model)
        {
            if (model == null)
            {
                return Json(new { success = false, message = "Model NULL!" });
            }

            // Lấy MaChuSan từ Session
            int? maChuSan = HttpContext.Session.GetInt32("maChuSan");
            if (maChuSan == null)
            {
                return Json(new { success = false, message = "Chưa đăng nhập." });
            }

            if (model.GiamGia <= 0 || model.GiamGia > 80)
            {
                return Json(new { success = false, message = "Giảm giá không hợp lệ." });
            }

            if (model.GioBd >= model.GioKt)
            {
                return Json(new { success = false, message = "Giờ mở phải nhỏ hơn giờ đóng." });
            }

            // ✅ Lấy các KM cũ
            var khuyenMais = _context.GiamGiaTheoGios
                .Where(x => x.MaChuSan == maChuSan)
                .ToList();

            // ✅ Kiểm tra trùng giờ
            foreach (var km in khuyenMais)
            {
                if (km.MaGiamGia == model.Id) continue;

                if (!(model.GioKt <= km.GioBd || km.GioKt <= model.GioBd))
                {
                    return Json(new
                    {
                        success = false,
                        message = $"Khung giờ bị trùng với [{km.GioBd} - {km.GioKt}]"
                    });
                }
            }

            var existing = _context.GiamGiaTheoGios.FirstOrDefault(x => x.MaGiamGia == model.Id && x.MaChuSan == maChuSan.Value);

            if (existing == null)
            {
                return Json(new { success = false, message = "Không tìm thấy chương trình cần sửa." });
            }


            // Cập nhật giá trị
            existing.GiamGia = model.GiamGia;
            existing.GioBd = model.GioBd;
            existing.GioKt = model.GioKt;

            _context.SaveChanges();

            return Json(new { success = true, message = "Cập nhật thành công!" });
        }

        [HttpPost]
        public IActionResult Xoa([FromBody] int id)
        {

            // Lấy MaChuSan từ Session
            int? maChuSan = HttpContext.Session.GetInt32("maChuSan");
            if (maChuSan == null)
            {
                return Json(new { success = false, message = "Chưa đăng nhập." });
            }

            var km = _context.GiamGiaTheoGios
                .FirstOrDefault(x => x.MaGiamGia == id && x.MaChuSan == maChuSan.Value);

            if (km == null)
            {
                return Json(new { success = false, message = "Không tìm thấy chương trình để xoá." });
            }

            _context.GiamGiaTheoGios.Remove(km);
            _context.SaveChanges();

            return Json(new { success = true, message = "Xóa thành công!" });
        }



    }

}
