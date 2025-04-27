using Football_3TL.Data;
using Football_3TL.Services.Vnpay;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.Customer.Controllers
{
    [Area("Customer")]
    public class DatSanController : Controller
    {
        private readonly IVnPayService _vnPayService;
        private readonly Football3tlContext dbContext;
        public DatSanController(Football3tlContext dbContext, IVnPayService vnPayService)
        {
            this.dbContext = dbContext;
            _vnPayService = vnPayService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetGioMoCua(int maChuSan)
        {
            var thongTin = dbContext.ThongTinBaiDangs
                .FirstOrDefault(x => x.MaChuSan == maChuSan);

            if (thongTin == null)
                return NotFound();

            return Json(new
            {
                gioMoCua = thongTin.GioMoCua,
                gioDongCua = thongTin.GioDongCua
            });
        }

        //[HttpGet]
        //public IActionResult GetSanTrong(DateTime ngayDat, string gioBatDau, int maChuSan)
        //{
        //    int thoiLuong = 60;
        //    TimeOnly gioBD = TimeOnly.Parse(gioBatDau);
        //    TimeOnly gioKT = gioBD.AddMinutes(thoiLuong);
        //    DateOnly ngay = DateOnly.FromDateTime(ngayDat);

        //    // Lấy tất cả đặt sân trong ngày và của chủ sân đó
        //    var datSansTrongNgay = dbContext.ThongTinDatSans
        //        .Where(ds => ds.NgayDat == ngay)
        //        .ToList(); // Chuyển về bộ nhớ để LINQ thường xử lý

        //    var sanTrong = dbContext.SanBongs
        //        .Where(sb => sb.MaChuSan == maChuSan)
        //        .ToList()
        //        .Where(sb => !datSansTrongNgay.Any(ds =>
        //            ds.MaSan == sb.MaSan &&
        //            ds.GioDat.HasValue &&
        //            gioBD < ds.GioDat.Value.AddMinutes(ds.ThoiLuong ?? 0) &&
        //            ds.GioDat.Value < gioKT
        //        ))
        //        .Select(sb => new
        //        {
        //            maSan = sb.MaSan,
        //            tenSan = sb.TenSan,
        //            loaiSan = sb.LoaiSan,
        //            gia = sb.Gia
        //        })
        //        .ToList();

        //    return Json(sanTrong);
        //}

        //[HttpGet]
        //public IActionResult GetSanTrong(DateOnly ngayDat, TimeOnly gioBatDau, int maChuSan)
        //{
        //    Console.WriteLine("---bắt đầu---");

        //    int thoiLuong = 60;
        //    var gioBD = gioBatDau;
        //    var gioKT = gioBD.AddMinutes(thoiLuong);

        //    Console.WriteLine("📅 Ngày đặt: " + ngayDat);
        //    Console.WriteLine("⏱️ Giờ bắt đầu: " + gioBD);
        //    Console.WriteLine("⏱️ Giờ kết thúc: " + gioKT);

        //    // Lấy danh sách đặt sân trong ngày
        //    var datSans = dbContext.ThongTinDatSans
        //        .Where(ds => ds.NgayDat == ngayDat && ds.MaChuSan == maChuSan && ds.GioDat.HasValue)
        //        .ToList();

        //    Console.WriteLine($"📋 Có {datSans.Count} sân đã được đặt trong ngày này.");

        //    // In thông tin từng khung giờ đã đặt để so sánh
        //    foreach (var ds in datSans)
        //    {
        //        var bStart = ds.GioDat!.Value;
        //        var bEnd = bStart.AddMinutes(ds.ThoiLuong ?? 0);
        //        var isOverlap = IsOverlapping(gioBD, gioKT, bStart, bEnd);

        //        Console.WriteLine($"🟥 MaSan={ds.MaSan}: [{bStart} - {bEnd}] vs [{gioBD} - {gioKT}] => Overlap: {isOverlap}");
        //    }

        //    // Lọc các sân chưa bị trùng giờ
        //    var sanTrong = dbContext.SanBongs
        //        .Where(sb => sb.MaChuSan == maChuSan)
        //        .ToList()
        //        .Where(sb =>
        //            !datSans.Any(ds =>
        //                ds.MaSan == sb.MaSan &&
        //                ds.GioDat.HasValue &&
        //                IsOverlapping(
        //                    gioBD,
        //                    gioKT,
        //                    ds.GioDat.Value,
        //                    ds.GioDat.Value.AddMinutes(ds.ThoiLuong ?? 0)
        //                )
        //            )
        //        )
        //        .Select(sb => new
        //        {
        //            maSan = sb.MaSan,
        //            tenSan = sb.TenSan,
        //            loaiSan = sb.LoaiSan,
        //            gia = sb.Gia
        //        })
        //        .ToList();

        //    Console.WriteLine($"✅ Có {sanTrong.Count} sân còn trống.");
        //    foreach (var san in sanTrong)
        //    {
        //        Console.WriteLine($"➤ Mã sân: {san.maSan}, Tên sân: {san.tenSan}, Loại sân: {san.loaiSan}, Giá: {san.gia}");
        //    }

        //    return Json(sanTrong);
        //}

        [HttpGet]
        public IActionResult GetSanTrong(DateOnly ngayDat, TimeOnly gioBatDau, int maChuSan, int thoiLuong)
        {
            Console.WriteLine("---bắt đầu---");

            var gioBD = gioBatDau;
            var gioKT = gioBD.AddMinutes(thoiLuong); // 🔥 dùng tham số mới

            Console.WriteLine("Ngay dat: " + ngayDat);
            Console.WriteLine("Gio bat dau: " + gioBD);
            Console.WriteLine("Gio ket thuc: " + gioKT);
            Console.WriteLine("Thoi luong: "+ thoiLuong);

            var datSans = dbContext.ThongTinDatSans
                .Where(ds => ds.NgayDat == ngayDat && ds.MaChuSan == maChuSan && ds.GioDat.HasValue)
                .ToList();

            foreach (var ds in datSans)
            {
                var bStart = ds.GioDat!.Value;
                var bEnd = bStart.AddMinutes(ds.ThoiLuong ?? 0);
                var isOverlap = IsOverlapping(gioBD, gioKT, bStart, bEnd);

                Console.WriteLine($"🟥 MaSan={ds.MaSan}: [{bStart} - {bEnd}] vs [{gioBD} - {gioKT}] => Overlap: {isOverlap}");
            }

            var sanTrong = dbContext.SanBongs
                .Where(sb => sb.MaChuSan == maChuSan)
                .ToList()
                .Where(sb =>
                    !datSans.Any(ds =>
                        ds.MaSan == sb.MaSan &&
                        ds.GioDat.HasValue &&
                        IsOverlapping(
                            gioBD,
                            gioKT,
                            ds.GioDat.Value,
                            ds.GioDat.Value.AddMinutes(ds.ThoiLuong ?? 0)
                        )
                    )
                )
                .Select(sb => new
                {
                    maSan = sb.MaSan,
                    tenSan = sb.TenSan,
                    loaiSan = sb.LoaiSan,
                    gia = sb.Gia
                })
                .ToList();

            Console.WriteLine($"✅ Có {sanTrong.Count} sân còn trống.");

            return Json(sanTrong);
        }
        // Hàm kiểm tra thời gian bị trùng
        private bool IsOverlapping(TimeOnly aStart, TimeOnly aEnd, TimeOnly bStart, TimeOnly bEnd)
        {
            return aStart < bEnd && bStart < aEnd;
        }

        [HttpGet]
        public IActionResult PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            return Json(response);
        }
    }
}
