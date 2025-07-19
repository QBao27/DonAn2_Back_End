using Football_3TL.Areas.Customer.Models;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.Customer.Controllers
{
    [Area("Customer")]
    public class HomeController : Controller
    {
        //thay thế cho database
        private readonly Football3tlContext _db;
        //tạo logger để ghi log để dễ kiểm tra lỗi
        private readonly ILogger<HomeController> _log;

        //tạo contructor 
        public HomeController(Football3tlContext db, ILogger<HomeController> log)
        {
            _db = db;
            _log = log;
        }

        public IActionResult Index()
        {
            return View();
        }

        //API lấy danh sách sân bóng
        //[HttpGet]
        //public async Task<IActionResult> getDanhSachSan()
        //{
        //    try
        //    {
        //        // 1. Lấy danh sách các ChuSan có ít nhất 1 TaiKhoan.TrangThai == "1"
        //        var list = await _db.ChuSans
        //            .AsNoTracking()
        //            .Include(c => c.TaiKhoans)         // load collection TaiKhoans
        //            .Include(c => c.ThongTinBaiDangs)
        //                .ThenInclude(b => b.HinhAnhBaiDangs)
        //            .Include(c => c.SanBongs)
        //            .Where(c => c.TaiKhoans.Any(tk => tk.TrangThai == "2"))
        //            .Select(c => new modelDanhSachSanBong
        //            {
        //                MaChuSan = c.MaChuSan,
        //                TenSanBong = c.TenSanBong,
        //                Huyen = c.Huyen,
        //                Tinh = c.Tinh,
        //                MaBaiDang = c.ThongTinBaiDangs
        //                                .Select(b => b.MaBaiDang)
        //                                .FirstOrDefault(),
        //                SoSanBong = c.SanBongs.Count(),
        //                AnhBaiDang = c.ThongTinBaiDangs
        //                                .SelectMany(b => b.HinhAnhBaiDangs)
        //                                .Where(img => img.ThuTu == 1)
        //                                .Select(img => img.HinhAnh)
        //                                .FirstOrDefault()
        //            })
        //             .Skip(1)  // Bỏ hoặc giữ tuỳ nhu cầu
        //            .ToListAsync();

        //        // 2. Đếm tổng số ChuSan hợp lệ
        //        var tongSoSan = await _db.ChuSans
        //            .Where(c => c.TaiKhoans.Any(tk => tk.TrangThai == "2"))
        //            .CountAsync();

        //        return Json(new { success = true, data = list, tongSan = tongSoSan - 1 });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { success = false, message = "Lỗi server: " + ex.Message });
        //    }
        //}

        // API lấy danh sách sân bóng + Tính số sao TB & số lượng đánh giá
        [HttpGet]
        public async Task<IActionResult> getDanhSachSan()
        {
            try
            {
                // 1. Lấy danh sách ChuSan có ít nhất 1 TaiKhoan.TrangThai == "2"
                var list = await _db.ChuSans
                    .AsNoTracking()
                    .Include(c => c.TaiKhoans)
                    .Include(c => c.ThongTinBaiDangs)
                        .ThenInclude(b => b.HinhAnhBaiDangs)
                    .Include(c => c.SanBongs)
                    .Include(c => c.DanhGia) // ✅ Bổ sung Include
                    .Include(c => c.KhuyenMais)
                    .Where(c => c.TaiKhoans.Any(tk => tk.TrangThai == "2"))
                    .Select(c => new modelDanhSachSanBong
                    {
                        MaChuSan = c.MaChuSan,
                        TenSanBong = c.TenSanBong,
                        Huyen = c.Huyen,
                        Tinh = c.Tinh,
                        MaBaiDang = c.ThongTinBaiDangs
                                        .Select(b => b.MaBaiDang)
                                        .FirstOrDefault(),
                        SoSanBong = c.SanBongs.Count(),
                        AnhBaiDang = c.ThongTinBaiDangs
                                        .SelectMany(b => b.HinhAnhBaiDangs)
                                        .Where(img => img.ThuTu == 1)
                                        .Select(img => img.HinhAnh)
                                        .FirstOrDefault(),

                        // ✅ Số sao trung bình
                        SoSaoTB = c.DanhGia.Any()
                                    ? c.DanhGia.Average(dg => dg.SoSao) ?? 0
                                    : 0,

                        // ✅ Số lượng đánh giá
                        SoDanhGia = c.DanhGia.Count(),

                        GiamGia = c.KhuyenMais
                               .Where(km =>
                                   km.MaChuSan == c.MaChuSan
                                   && km.TrangThai == "Đang diễn ra"
                               // hoặc nếu dùng ngày bắt đầu/kết thúc:
                               // && km.NgayBatDau <= now
                               // && km.NgayKetThuc >= now
                               )
                               .Select(km => km.GiamGia)  // hoặc km.GiamGia
                               .FirstOrDefault()
                    })
                    .Skip(1)
                    .ToListAsync();

                // 2. Đếm tổng số ChuSan hợp lệ
                var tongSoSan = await _db.ChuSans
                    .Where(c => c.TaiKhoans.Any(tk => tk.TrangThai == "2"))
                    .CountAsync();

                return Json(new { success = true, data = list, tongSan = tongSoSan });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }



        //API tra cứu lịch sử đặt sân 
        [HttpGet]
        public async Task<IActionResult> TraCuuLichSu(string soDienThoai)
        {
            try
            {
                var danhSachThongTin = await _db.ThongTinDatSans
                    .AsNoTracking()  // nếu chỉ đọc thôi, không cần track thay đổi
                                     // Nạp luôn thông tin Khách hàng
                    .Include(dp => dp.MaKhachHangNavigation)
                    // Nạp luôn thông tin Sân bóng
                    .Include(dp => dp.MaSanNavigation)
                    .Include(dp => dp.MaChuSanNavigation)
                    // Lọc theo số điện thoại của Khách hàng
                    .Where(dp => dp.MaKhachHangNavigation != null
                              && dp.MaKhachHangNavigation.SoDienThoai == soDienThoai)
                    // Chiếu lên DTO modelLichSuDatSan
                    .Select(dp => new modelLichSuDatSan
                    {
                        MaKhachHang = dp.MaKhachHang,
                        MaDatSan = dp.MaDatSan,
                        NgayDat = dp.NgayDat,
                        GioDat = dp.GioDat,
                        MaSan = dp.MaSan,
                        ThoiLuong = dp.ThoiLuong,
                        TrangThaiThanhToan = dp.TrangThaiThanhToan,
                        // Hoặc lấy trực tiếp từ navigation nếu bạn muốn chắc chắn lấy tên sân chuẩn từ bảng SanBong
                        TenSan = dp.MaSanNavigation!.TenSan,         // bảng SanBong
                        TenSanBong = dp.MaChuSanNavigation!.TenSanBong,
                        TenKhachHang = dp.MaKhachHangNavigation!.HoVaTen,
                        TongThanhToan = dp.MaSanNavigation.Gia * (dp.ThoiLuong / 60)
                    }).ToListAsync();

                // Nếu không tìm thấy, trả về thông báo
                if (danhSachThongTin == null || !danhSachThongTin.Any())
                {
                    return Json(new { success = false, message = "Không tìm thấy thông tin đặt sân với số điện thoại cung cấp." });
                }

                // Trả về danh sách thông tin
                return Json(new { success = true, data = danhSachThongTin });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }
    }
}
