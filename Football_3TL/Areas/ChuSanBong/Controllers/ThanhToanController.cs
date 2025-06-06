﻿using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    public class ThanhToanController : Controller
    {
        //thay thế cho database
        private readonly Football3tlContext _db;
        //tạo logger để ghi log để dễ kiểm tra lỗi
        private readonly ILogger<ThanhToanController> _log;

        //tạo contructor 
        public ThanhToanController(Football3tlContext db, ILogger<ThanhToanController> log)
        {
            _db = db;
            _log = log;
        }

        public IActionResult Index()
        {
            return View();
        }

        //API lấy thông tin đặt sân chưa thanh toán
        public async Task<IActionResult> getThongTinDatSanTT()
        {
            try
            {
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                if (!maChuSan.HasValue)
                {
                    _log.LogError("maChuSan is null. Session might not be set.");
                    return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
                }
                var thongTin = await _db.ThongTinDatSans
                            .Where(tt => tt.MaChuSan == maChuSan && tt.TrangThaiThanhToan == "Chưa thanh toán")
                            .Include(tt => tt.MaSanNavigation)  // Kết hợp thông tin sân bóng
                            .Select(tt => new
                            {
                                tt.MaDatSan,
                                tt.MaSan,              
                                tt.TrangThaiSan,
                                tt.TrangThaiThanhToan,
                                TenSan = tt.MaSanNavigation.TenSan,
                                GiaSan = tt.MaSanNavigation.Gia,
                                LoaiSan = tt.MaSanNavigation.LoaiSan
                            })
                            .ToListAsync();

                return Json(new { success = true, data = thongTin, message = "Lấy thông tin thành công!" });
            }
            catch (Exception)
            {

                return Json(new { success = false, message = "Lỗi Sever, vui lòng thử lại sau!" });
            }
        }
    }
}
