using Football_3TL.Areas.ChuSanBong.Models;
using Football_3TL.Areas.KhachHang.Controllers;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    public class QuanLyDatSanController : Controller
    {
        //thay thế cho database
        private readonly Football3tlContext _db;
        //tạo logger để ghi log để dễ kiểm tra lỗi
        private readonly ILogger<QuanLyDatSanController> _log;

        //tạo contructor 
        public QuanLyDatSanController(Football3tlContext db, ILogger<QuanLyDatSanController> log)
        {
            _db = db;
            _log = log;
        }
        // Hiển thị thông tin sân bóng tại thời điểm hiện tại
        public IActionResult Index()
        {
            try
            {
                // Lưu giá trị DateTime.Now để đảm bảo tính nhất quán
                var now = DateTime.Now;
                var today = DateOnly.FromDateTime(now);
                var currentTime = TimeOnly.FromDateTime(now);

                // Lấy maChuSan từ session
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                if (!maChuSan.HasValue)
                {
                    _log.LogError("maChuSan is null. Session might not be set.");
                    return View(new List<modelQuanLyDatSan>());
                }

                // Bước 1: Lấy dữ liệu từ SanBong và ThongTinDatSans
                var sanBongData = _db.SanBongs
                    .Where(s => s.MaChuSan == maChuSan)
                    .Include(db => db.ThongTinDatSans)
                    .Select(s => new
                    {
                        s.TenSan,
                        s.LoaiSan,
                        s.Gia,
                        ThongTinDatSans = s.ThongTinDatSans
                    })
                    .ToList();

                // Bước 2: Ánh xạ dữ liệu sang modelQuanLyDatSan và tính toán TrangThai, TrangThaiThanhToan
                var danhSachSanBong = sanBongData
                    .Select(s => 
                    {
                       var thongTin = s.ThongTinDatSans
                        .OrderByDescending(t => t.ThoiGianDat)
                        .FirstOrDefault(t => t.NgayDat == today
                            && t.GioDat.HasValue
                            && currentTime >= t.GioDat.Value
                            && currentTime <= t.GioDat.Value.AddMinutes(t.ThoiLuong ?? 0));

                        return new modelQuanLyDatSan
                        {
                            TenSan = s.TenSan,
                            LoaiSan = s.LoaiSan,
                            GiaSan = s.Gia,
                            TrangThai = thongTin?.TrangThaiSan ?? "Trống",
                            TrangThaiThanhToan = thongTin?.TrangThaiThanhToan ?? "Sân chưa đặt"
                        };
                    })
                    .ToList();

                return View(danhSachSanBong);
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi server, không thể lấy được danh sách sân bóng");
                return View(new List<modelQuanLyDatSan>());
            }
        }

        [HttpGet]
        public async Task<IActionResult> LoadSanBong([FromQuery] ModelThongTinTimKiem model)
        {
            try
                {
                Console.WriteLine($"Model Received: {JsonConvert.SerializeObject(model)}");
                // Lưu giá trị DateTime.Now để đảm bảo tính nhất quán
                var now = DateTime.Now;
                var today = DateOnly.FromDateTime(now);
                var currentTime = TimeOnly.FromDateTime(now);

                var maChuSan = HttpContext.Session.GetInt32("maChuSan");

                if (maChuSan == null)
                {
                    return Json(new { success = false, message = "Tài khoản chưa đăng nhập!" });
                }

                // lấy thông tin sân bóng của chủ sân
                var sanBongData = await _db.SanBongs
                    .Where(s => s.MaChuSan == maChuSan)
                    .Include(db => db.ThongTinDatSans)
                    .Select(s => new
                    {
                        s.TenSan,
                        s.LoaiSan,
                        s.Gia,
                        ThongTinDatSans = s.ThongTinDatSans
                    })
                    .ToListAsync();

                List<modelQuanLyDatSan>? danhSachSanBong = null;

                if (model.NgayNhan == null)
                {
                    //Nếu chưa chọn ngày thì lấy thời điểm hiện tại kiểm tra ngày hiện tại và giờ với ngày đặt và giờ đặt
                    danhSachSanBong = sanBongData
                    .Select(s =>
                    {
                        var thongTin = s.ThongTinDatSans
                        .OrderByDescending(t => t.ThoiGianDat)
                        .FirstOrDefault(t => t.NgayDat == today
                            && t.GioDat.HasValue
                            && currentTime >= t.GioDat.Value
                            && currentTime <= t.GioDat.Value.AddMinutes(t.ThoiLuong ?? 0));
                        
                        return new modelQuanLyDatSan
                        {
                            TenSan = s.TenSan,
                            LoaiSan = s.LoaiSan,
                            GiaSan = s.Gia,
                            TrangThai = thongTin?.TrangThaiSan ?? "Trống",
                            TrangThaiThanhToan = thongTin?.TrangThaiThanhToan ?? "Sân chưa đặt"
                        };
                    })
                    .ToList();
                }
                else if (model.KhungGio == null)
                {
                    //Nếu chọn ngày mà chưa chọn giờ thì lấy ngày đã chọn kiểm tra với ngày đặt 
                    danhSachSanBong = sanBongData
                     .Select(s =>
                     {
                         var thongTin = s.ThongTinDatSans
                         .OrderByDescending(t => t.ThoiGianDat)
                         .FirstOrDefault(t => t.NgayDat == model.NgayNhan);

                         return new modelQuanLyDatSan
                         {
                             TenSan = s.TenSan,
                             LoaiSan = s.LoaiSan,
                             GiaSan = s.Gia,
                             TrangThai = thongTin?.TrangThaiSan ?? "Trống",
                             TrangThaiThanhToan = thongTin?.TrangThaiThanhToan ?? "Sân chưa đặt"
                         };
                     })
                     .ToList();
                }
                else 
                {
                    //Nếu chọn ok thì lấy ngày đã chọn kiểm tra với ngày đặt lấy thời gian đã chọn và thời lượng kiểm tra xem nó có nằm trong thời gian đã đặt hay không (dựa vào thời lượng và giờ đặt)
                    danhSachSanBong = sanBongData
                     .Select(s =>
                     {
                         var thongTin = s.ThongTinDatSans
                         .OrderByDescending(t => t.ThoiGianDat)
                         .FirstOrDefault(t =>
                            (t.NgayDat == model.NgayNhan &&
                             t.GioDat.HasValue &&
                                (
                                    (model.KhungGio == t.GioDat.Value || model.KhungGio.Value.AddMinutes((double)model.ThoiLuong) == t.GioDat.Value.AddMinutes(t.ThoiLuong ?? 0))
                                    ||
                                    (model.KhungGio > t.GioDat.Value &&
                                     model.KhungGio < t.GioDat.Value.AddMinutes(t.ThoiLuong ?? 0))
                                    ||
                                    (model.KhungGio.Value.AddMinutes((double)model.ThoiLuong) > t.GioDat.Value &&
                                     model.KhungGio.Value.AddMinutes((double)model.ThoiLuong) < t.GioDat.Value.AddMinutes(t.ThoiLuong ?? 0))
                                )
                            )
                         );
                         return new modelQuanLyDatSan
                         {
                             TenSan = s.TenSan,
                             LoaiSan = s.LoaiSan,
                             GiaSan = s.Gia,
                             TrangThai = thongTin?.TrangThaiSan ?? "Trống",
                             TrangThaiThanhToan = thongTin?.TrangThaiThanhToan ?? "Sân chưa đặt"
                         };
                     })
                     .ToList();
                }

                return Json(new { success = true, data = danhSachSanBong });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi khi tải dữ liệu!", error = ex.Message });
            }
        }




    }
}
