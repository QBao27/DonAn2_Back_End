using Football_3TL.Areas.ChuSanBong.Models;
using Football_3TL.Areas.Customer.Controllers;
using Football_3TL.Data;
using Football_3TL.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NuGet.Versioning;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    [CheckGoiHetHan]
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
                    return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
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
                        s.MaSan,
                        ThongTinDatSans = s.ThongTinDatSans
                    })
                    .ToList();
                var khuyenMai = _db.KhuyenMais
             .AsNoTracking()
             .FirstOrDefault(km =>
                 km.MaChuSan == maChuSan &&
                 km.TrangThai == "Đang diễn ra" &&
                 km.NgayBd <= today &&
                 km.NgayKt >= today);

                var coKhuyenMai = khuyenMai != null;
                double mucGiam = coKhuyenMai ? (double)khuyenMai.GiamGia : 0;

                // Bước 2: Ánh xạ dữ liệu sang modelQuanLyDatSan và tính toán TrangThai, TrangThaiThanhToan
                var danhSachSanBong = sanBongData
                    .Select(s => 
                    {
                       var thongTin = s.ThongTinDatSans
                        .OrderByDescending(t => t.ThoiGianDat)
                        .FirstOrDefault(t => t.NgayDat == today
                            && t.GioDat.HasValue
                            && currentTime >= t.GioDat.Value
                            && currentTime < t.GioDat.Value.AddMinutes(t.ThoiLuong ?? 0));

                        return new modelQuanLyDatSan
                        {
                            TenSan = s.TenSan,
                            LoaiSan = s.LoaiSan,
                            GiaSan = coKhuyenMai ? (s.Gia - (s.Gia * mucGiam / 100)) : s.Gia,
                            MaSan = s.MaSan,
                            TrangThai = thongTin?.TrangThaiSan ?? "Trống",
                            TrangThaiThanhToan = thongTin?.TrangThaiThanhToan ?? "Sân chưa đặt",
                            MaDatSan = thongTin?.MaDatSan ?? 0,
                        };
                    })
                    .ToList();
                Console.WriteLine(danhSachSanBong);

                ViewBag.KhuyenMai = coKhuyenMai;
                ViewBag.MucGiam = mucGiam;
                ViewBag.TenKhuyenMai = khuyenMai?.TenKm;
                ViewBag.NgayBd = khuyenMai?.NgayBd;
                ViewBag.NgayKt = khuyenMai?.NgayKt;// nếu muốn hiển thị tên khuyến mãi

                return View(danhSachSanBong);
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi server, không thể lấy được danh sách sân bóng");
                return View(new List<modelQuanLyDatSan>());
            }
        }

        //API load thông tin theo tìm kiếm 
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
                    {   s.MaSan,
                        s.TenSan,
                        s.LoaiSan,
                        s.Gia,
                        ThongTinDatSans = s.ThongTinDatSans
                    })
                    .ToListAsync();

                List<modelQuanLyDatSan>? danhSachSanBong = null;
                var khuyenMai = _db.KhuyenMais
            .AsNoTracking()
            .FirstOrDefault(km =>
                km.MaChuSan == maChuSan &&
                km.TrangThai == "Đang diễn ra" &&
                km.NgayBd <= model.NgayNhan &&
                km.NgayKt >= model.NgayNhan);

                var coKhuyenMai = khuyenMai != null;
                double mucGiam = coKhuyenMai ? (double)khuyenMai.GiamGia : 0;

                if (model.NgayNhan == null)
                {
                    khuyenMai = _db.KhuyenMais
            .AsNoTracking()
            .FirstOrDefault(km =>
                km.MaChuSan == maChuSan &&
                km.TrangThai == "Đang diễn ra" &&
                km.NgayBd <= today &&
                km.NgayKt >= today);

                    coKhuyenMai = khuyenMai != null;
                    mucGiam = coKhuyenMai ? (double)khuyenMai.GiamGia : 0;
                    //Nếu chưa chọn ngày thì lấy thời điểm hiện tại kiểm tra ngày hiện tại và giờ với ngày đặt và giờ đặt
                    danhSachSanBong = sanBongData
                    .Select(s =>
                    {
                        var thongTin = s.ThongTinDatSans
                        .OrderByDescending(t => t.ThoiGianDat)
                        .FirstOrDefault(t => t.NgayDat == today
                            && t.GioDat.HasValue
                            && currentTime >= t.GioDat.Value
                            && currentTime < t.GioDat.Value.AddMinutes(t.ThoiLuong ?? 0));
                        
                        return new modelQuanLyDatSan
                        {
                            TenSan = s.TenSan,
                            LoaiSan = s.LoaiSan,
                            GiaSan = coKhuyenMai ? (s.Gia - (s.Gia * mucGiam / 100)) : s.Gia,
                            MaSan = s.MaSan,
                            TrangThai = thongTin?.TrangThaiSan ?? "Trống",
                            TrangThaiThanhToan = thongTin?.TrangThaiThanhToan ?? "Sân chưa đặt",
                            MaDatSan = thongTin?.MaDatSan ?? 0
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
                             GiaSan = coKhuyenMai ? (s.Gia - (s.Gia * mucGiam / 100)) : s.Gia,
                             MaSan = s.MaSan,
                             TrangThai = thongTin?.TrangThaiSan ?? "Trống",
                             TrangThaiThanhToan = thongTin?.TrangThaiThanhToan ?? "Sân chưa đặt",
                             MaDatSan = thongTin?.MaDatSan ?? 0
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
                             GiaSan = coKhuyenMai ? (s.Gia - (s.Gia * mucGiam / 100)) : s.Gia,
                             MaSan = s.MaSan,
                             TrangThai = thongTin?.TrangThaiSan ?? "Trống",
                             TrangThaiThanhToan = thongTin?.TrangThaiThanhToan ?? "Sân chưa đặt",
                             MaDatSan = thongTin?.MaDatSan ?? 0
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

        //API Lấy thông tin hiện lên modal 
        [HttpGet]
        public async Task<IActionResult> getThongTinDatSan(int maDatSan)
        {
            try
            {
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                if (!maChuSan.HasValue)
                {
                    _log.LogError("maChuSan is null. Session might not be set.");
                    return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
                }
                var thongTin = await _db.ThongTinDatSans.Include(kh => kh.MaKhachHangNavigation).Include(sb => sb.MaSanNavigation).FirstOrDefaultAsync(t => t.MaDatSan == maDatSan && t.MaChuSan == maChuSan);

                if (thongTin == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy thông tin đặt sân." });
                }

                var dataGet = new
                {
                    thongTin.MaKhachHangNavigation?.HoVaTen,
                    thongTin.MaKhachHangNavigation?.SoDienThoai,
                    thongTin.NgayDat,
                    thongTin.GioDat, 
                    thongTin.ThoiLuong,
                    thongTin.GhiChu, 
                    thongTin.MaSanNavigation?.Gia,
                    thongTin.MaDatSan,
                    thongTin.TongThanhToan
                };

                return Json(new { success = true, data = dataGet });

            }
            catch (Exception)
            {

                return Json(new { success = false, message = "Lỗi sever, vui lòng thử lại sau!" });
            }
        }

        //API cập nhật trạng thái thanh toán
        public async Task<IActionResult> UpdateTrangThaiTT(int? id)
        {
            try
            {
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                if (!maChuSan.HasValue)
                {
                    _log.LogError("maChuSan is null. Session might not be set.");
                    return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
                }

                if (id == null)
                {
                    return Json(new { success = false, message = "Mã đặt sân không hợp lệ!" });
                }

                var thongTin = await _db.ThongTinDatSans
                    .Where(tt => tt.MaChuSan == maChuSan && tt.MaDatSan == id)
                    .FirstOrDefaultAsync();

                if (thongTin == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy thông tin đặt sân!" });
                }

                // Cập nhật trạng thái thanh toán
                thongTin.TrangThaiThanhToan = "Đã thanh toán"; // hoặc true nếu là kiểu bool

                _db.ThongTinDatSans.Update(thongTin);
                await _db.SaveChangesAsync();
                // lưu thông tin vào bảng hóa đơn
                var hoaDon = new HoaDon
                {
                    MaDatSan = thongTin.MaDatSan,
                    ThoiGian = DateOnly.FromDateTime(DateTime.Now)
                };

                _db.HoaDons.Add(hoaDon);
                await _db.SaveChangesAsync();

                return Json(new { success = true, message = "Cập nhật trạng thái thanh toán thành công!" });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi cập nhật trạng thái thanh toán.");
                return Json(new { success = false, message = "Lỗi server, vui lòng thử lại sau!" });
            }
        }

        //API đặt sân trống
        [HttpPost]
        public async Task<IActionResult> datSanTrong([FromBody] modelThongTinDatSan model)
        {
            try
            {
                // Hoặc nếu bạn dùng logging, bạn có thể ghi log như sau: 
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                if (!maChuSan.HasValue)
                {
                    _log.LogError("maChuSan is null. Session might not be set.");
                    return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
                }

                if (model == null)
                {
                    _log.LogError("Thông tin đặt sân không hợp lệ!");
                    return Json(new { success = false, message = "Thông tin đặt sân không hợp lệ!" });
                }
                // lấy mã khách hàng rồi + 1
                var lastKhachHang = _db.KhachHangs
                     .Where(k => k.MaKhachHang.StartsWith("KH"))
                     .AsEnumerable() // chuyển sang client evaluation
                     .Select(k => new {
                         MaKhachHang = k.MaKhachHang,
                         Number = int.Parse(k.MaKhachHang.Substring(2))
                     })
                     .OrderByDescending(x => x.Number)
                     .FirstOrDefault();

                int newNumber = (lastKhachHang != null) ? lastKhachHang.Number + 1 : 1;
                string newMaKhachHang = "KH" + newNumber.ToString("D3");
                var khachHang = new KhachHang
                {
                    MaKhachHang = newMaKhachHang,
                    HoVaTen = model.hoTenKH,
                    SoDienThoai = model.soDienThoaiKH,
                }; 

                await _db.KhachHangs.AddAsync(khachHang);
                await _db.SaveChangesAsync();

                var thongTinDatSan = new ThongTinDatSan
                {
                    MaChuSan = maChuSan.Value,
                    MaKhachHang = khachHang.MaKhachHang, // Lấy từ khách hàng vừa insert
                    ThoiGianDat = DateOnly.FromDateTime(DateTime.Now),
                    NgayDat = model.NgayDat,
                    GioDat = model.GioDat,
                    ThoiLuong = model.ThoiLuong,
                    GhiChu = model.GhiChu,
                    MaSan = model.MaSan,
                    TenSan = model.TenSan,
                    TrangThaiThanhToan = "Chưa thanh toán",
                    TrangThaiSan = "Đã đặt",
                    TongThanhToan = model.TongThanhtoan,
                    //thêm tổng thanh toán vào đây để lưu 
                };

                await _db.ThongTinDatSans.AddAsync(thongTinDatSan);
                await _db.SaveChangesAsync();

                return Json(new { success = true, message = "Đặt sân thành công!" });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi đặt sân trống.");
                return Json(new { success = false, message = "Lỗi server, vui lòng thử lại sau!" });
            }
        }

        //API thay đổi trạng thái sân theo thời gian
        [HttpPost]
        public async Task<IActionResult> UpdateTrangThaiSan()
        {
            try
            {
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                if (!maChuSan.HasValue)
                {
                    _log.LogError("maChuSan is null. Session might not be set.");
                    return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
                }

                var now = DateTime.Now;
                var currentDate = DateOnly.FromDateTime(now);
                var currentTime = TimeOnly.FromDateTime(now);

                // Lấy tất cả các lượt đặt của chủ sân
                var danhSachDatSan = await _db.ThongTinDatSans
                    .Where(t => t.MaChuSan == maChuSan && t.NgayDat == currentDate)
                    .ToListAsync();

                foreach (var datSan in danhSachDatSan)
                {
                    // Kiểm tra nếu có giá trị giờ đặt (GioDat)
                    if (datSan.GioDat.HasValue)
                    {
                        var gioBatDau = datSan.GioDat.Value;
                        var gioKetThuc = gioBatDau.AddMinutes(datSan.ThoiLuong ?? 0);

                        if (currentTime >= gioKetThuc)
                        {
                            datSan.TrangThaiSan = "Hết giờ";
                        }
                        else if (currentTime >= gioBatDau && currentTime < gioKetThuc)
                        {
                            datSan.TrangThaiSan = "Đang hoạt động";
                        }
                        else
                        {
                            datSan.TrangThaiSan = "Đã đặt";
                        }
                    }
                }

                await _db.SaveChangesAsync();

                return Json(new { success = true, message = "Cập nhật trạng thái sân thành công!" });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Lỗi khi cập nhật trạng thái sân.");
                return Json(new { success = false, message = "Lỗi server, vui lòng thử lại sau!" });
            }
        }

        
    }
}
