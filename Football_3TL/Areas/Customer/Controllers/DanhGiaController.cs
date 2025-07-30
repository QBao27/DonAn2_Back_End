using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.Customer.Controllers
{
    [Area("Customer")]
    [Route("Customer/[controller]/[action]")]
    public class DanhGiaController : Controller
    {
        
        private readonly Football3tlContext dbContext;

        public DanhGiaController(Football3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public IActionResult Index()
        {
            return View();
        }

        // API lấy danh sách đánh giá theo MaChuSan
        [HttpGet]
        public IActionResult GetDanhGiaByMaChuSan(int maChuSan)
        {
            var danhGias = dbContext.DanhGia
                .Where(dg => dg.MaChuSan == maChuSan)
                .OrderByDescending(dg => dg.MaDanhGia)
                .ToList();

            return Ok(danhGias);
        }

        [HttpPost]
        public IActionResult Create(string FullName, string PhoneNumber, string Content, int Rating, int MaChuSan)
        {
            try
            {
                // 1. Tìm khách hàng dựa theo số điện thoại
                var khachHang = dbContext.KhachHangs
                    .FirstOrDefault(kh => kh.SoDienThoai == PhoneNumber);

                if (khachHang == null)
                {
                    return Json(new { success = false, message = "Số điện thoại không tồn tại trong hệ thống. Vui lòng đặt sân." });
                }

                var danhSachMaKhachHang = dbContext.KhachHangs
                                        .Where(kh => kh.SoDienThoai == PhoneNumber)
                                        .Select(kh => kh.MaKhachHang)
                                        .ToList();
                // 2. Kiểm tra KH đó có từng đặt sân với MaChuSan này chưa
                var daDatSan = dbContext.ThongTinDatSans
                                 .Any(ds =>
                                     danhSachMaKhachHang.Contains(ds.MaKhachHang) &&
                                     ds.MaChuSan == MaChuSan
                                 );

                if (!daDatSan)
                {
                    return Json(new { success = false, message = "Bạn chưa từng đặt sân tại cơ sở này nên không thể đánh giá." });
                }

                // 3. Cho phép lưu đánh giá
                var danhGia = new DanhGia
                {
                    HoTen = FullName,
                    SoDienThoai = PhoneNumber,
                    NoiDung = Content,
                    SoSao = Rating,
                    MaChuSan = MaChuSan,  // MaChuSan được gửi từ form
                    ThoiGian = TimeOnly.FromDateTime(DateTime.Now)
                };

                dbContext.DanhGia.Add(danhGia);
                dbContext.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra khi gửi đánh giá." });
            }
        }


        [HttpGet]
        public async Task<IActionResult> TinhTrungBinhSao(int maChuSan)
        {
            var danhGiaList = await dbContext.DanhGia
                .Where(dg => dg.MaChuSan == maChuSan && dg.SoSao.HasValue)
                .ToListAsync();

            if (danhGiaList.Count == 0)
            {
                return Json(new { success = true, soSaoTrungBinh = 0 });
            }

            var soSaoTrungBinh = danhGiaList.Average(dg => dg.SoSao.Value);

            return Json(new { success = true, soSaoTrungBinh = Math.Round(soSaoTrungBinh, 1) }); // Làm tròn 1 chữ số
        }

        [HttpGet]
        public async Task<IActionResult> DemDanhGia(int maChuSan)
        {
            var soDanhGia = await dbContext.DanhGia
                .Where(dg => dg.MaChuSan == maChuSan)
                .CountAsync();

            return Json(soDanhGia); // Trả về JSON cho client
        }

        [HttpGet]
        public async Task<IActionResult> DemDanhGia5(int maChuSan)
        {
            var danhGiaTheoSao = await dbContext.DanhGia
                .Where(dg => dg.MaChuSan == maChuSan)
                .GroupBy(dg => dg.SoSao)
                .Select(g => new
                {
                    SoSao = g.Key,
                    SoLuong = g.Count()
                })
                .ToListAsync();

            // Tạo dictionary chuẩn 5 -> 1 sao, nếu không có thì gán 0
            var ketQua = new Dictionary<int, int>();
            for (int i = 5; i >= 1; i--)
            {
                var sao = danhGiaTheoSao.FirstOrDefault(x => x.SoSao == i);
                ketQua[i] = sao?.SoLuong ?? 0; // nếu không có thì 0
            }

            return Json(ketQua);
        }

        [HttpGet]
        public async Task<IActionResult> GetHinhAnh(int maChuSan)
        {
            try
            {
                var baiDang = await dbContext.ThongTinBaiDangs
                    .FirstOrDefaultAsync(x => x.MaChuSan == maChuSan);

                if (baiDang == null)
                {
                    return Json(new { success = false, message = "Chưa có bài đăng!" });
                }

                var images = await dbContext.HinhAnhBaiDangs
                    .Where(x => x.MaBaiDang == baiDang.MaBaiDang)
                    .OrderBy(x => x.ThuTu)
                    .ToListAsync();

                Console.WriteLine("Danh sách hình ảnh:");
                foreach (var img in images)
                {
                    Console.WriteLine($"ThuTu: {img.ThuTu}, HinhAnh: {img.HinhAnh}");
                }

                if (!images.Any())
                {
                    return Json(new { success = false, message = "Không có hình ảnh để hiển thị!" });
                }

                var result = images.Select(x => new
                {
                    ImgIndex = $"img{x.ThuTu}", // ví dụ img1, img2
                    HinhAnh = Url.Content(x.HinhAnh)
                }).ToList();

                return Json(new { success = true, data = result });
            }
            catch (Exception)
            {
                return Json(new { success = false, message = "Lỗi server!" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetGioMoDongCua(int maChuSan)
        {
            try
            {
                var baiDang = await dbContext.ThongTinBaiDangs
                    .FirstOrDefaultAsync(x => x.MaChuSan == maChuSan);

                if (baiDang == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy bài đăng!" });
                }

                return Json(new
                {
                    success = true,
                    data = new
                    {
                        gioMoCua = baiDang.GioMoCua,
                        gioDongCua = baiDang.GioDongCua
                    }
                });
            }
            catch (Exception)
            {
                return Json(new { success = false, message = "Lỗi server!" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetSoLuongSan(int maChuSan)
        {
            try
            {
                var soLuongSan = await dbContext.SanBongs
                    .CountAsync(x => x.MaChuSan == maChuSan);

                return Json(new { success = true, soSan = soLuongSan });
            }
            catch (Exception)
            {
                return Json(new { success = false, message = "Lỗi server!" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetThongTinChuSan(int maChuSan)
        {
            try
            {
                var chuSan = await dbContext.ChuSans
                    .FirstOrDefaultAsync(x => x.MaChuSan == maChuSan);

                if (chuSan == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy chủ sân!" });
                }

                var diaChiDayDu = $"{chuSan.DiaChi}, {chuSan.Xa}, {chuSan.Huyen}, {chuSan.Tinh}";

                return Json(new
                {
                    success = true,
                    tenSanBong = chuSan.TenSanBong ?? "",
                    diaChi = diaChiDayDu
                });
            }
            catch (Exception)
            {
                return Json(new { success = false, message = "Lỗi server!" });
            }
        }

    }
}
