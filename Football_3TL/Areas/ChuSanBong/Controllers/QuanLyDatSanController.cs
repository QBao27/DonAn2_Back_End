using Football_3TL.Areas.ChuSanBong.Models;
using Football_3TL.Areas.KhachHang.Controllers;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        public IActionResult Index()
        {
            try
            {
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                var danhSachSanBong = _db.SanBongs.Where(s => s.MaChuSan == maChuSan).Include(db => db.ThongTinDatSans).Select(s => new modelQuanLyDatSan
                {
                   TenSan = s.TenSan,
                   LoaiSan = s.LoaiSan,
                   GiaSan = s.Gia,
                   TrangThai = s.ThongTinDatSans.Select(t => t.TrangThaiSan).FirstOrDefault() ?? "Trống",
                   TrangThaiThanhToan = s.ThongTinDatSans.Select(t => t.TrangThaiThanhToan).FirstOrDefault() ?? "Sân chưa đặt",
                }).ToList();
                return View(danhSachSanBong);
            }
            catch (Exception)
            {
                _log.LogError("lỗi server, không thể lấy được danh sách sân bóng");
                return View();
            }

        }
    }
}
