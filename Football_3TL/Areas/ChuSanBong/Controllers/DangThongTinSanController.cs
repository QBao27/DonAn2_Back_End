using Football_3TL.Areas.ChuSanBong.Models;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Runtime.Intrinsics.Arm;
using static NuGet.Packaging.PackagingConstants;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    public class DangThongTinSanController : Controller
    {
        private readonly Football3tlContext dbContext;
        public DangThongTinSanController(Football3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public IActionResult Index()
        {
            return View();
        }

        //API cập nhật hình ảnh
        [HttpPost]
        public async Task<IActionResult> UpdateImages(
            [FromForm] List<IFormFile> files,
            [FromForm] List<int> orders)
        {
            try
            {
                // Lấy ID bài đăng (hoặc chủ sân) từ session
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                if (maChuSan == null)
                    return Json(new { success = false, message = "Bạn chưa đăng nhập!" });

                // Validate đầu vào
                if (files == null || files.Count == 0)
                    return Json(new { success = true, message = "Không có ảnh nào được thay đổi." });
                if (orders == null || files.Count != orders.Count)
                    return Json(new { success = false, message = "Dữ liệu upload không hợp lệ." });

                // Tìm bài đăng trong DB
                var baiDang = await dbContext.ThongTinBaiDangs
                    .FirstOrDefaultAsync(x => x.MaChuSan == maChuSan);
                if (baiDang == null)
                    return Json(new { success = false, message = "Bài đăng không tồn tại!" });

                // Chuẩn bị thư mục lưu ảnh: wwwroot/Img/{maChuSan}/
                var contentRoot = Directory.GetCurrentDirectory();
                var uploadDir = Path.Combine(contentRoot, "wwwroot", "Img", maChuSan.ToString() ?? "0");
                if (!Directory.Exists(uploadDir))
                    Directory.CreateDirectory(uploadDir);

                // Convert khóa ngoại sang string nếu cần
                var maBaiDangKey = baiDang.MaBaiDang.ToString();

                // Xử lý từng file
                for (int i = 0; i < files.Count; i++)
                {
                    var file = files[i];
                    var order = orders[i]; // 1..4

                    // Lấy tên file gốc và path
                    var fileName = Path.GetFileName(file.FileName);
                    var fullPath = Path.Combine(uploadDir, fileName);

                    // Nếu file chưa tồn tại trên đĩa, lưu mới
                    if (!System.IO.File.Exists(fullPath))
                    {
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                    }

                    // Đường dẫn tương đối để lưu vào DB
                    var relativePath = $"/Img/{maChuSan}/{fileName}";

                    // Tìm record HinhAnhBaiDang với MaBaiDang và ThuTu = order
                    var imgRecord = await dbContext.HinhAnhBaiDangs
                        .FirstOrDefaultAsync(x => x.MaBaiDang == maBaiDangKey && x.ThuTu == order);

                    if (imgRecord == null)
                    {
                        // Tạo mới nếu chưa có
                        imgRecord = new HinhAnhBaiDang
                        {
                            MaBaiDang = maBaiDangKey,
                            ThuTu = order,
                            HinhAnh = relativePath
                        };
                        dbContext.HinhAnhBaiDangs.Add(imgRecord);
                    }
                    else
                    {
                        // Cập nhật đường dẫn cho record đã tồn tại
                        imgRecord.HinhAnh = relativePath;
                    }
                }

                // Lưu mọi thay đổi
                await dbContext.SaveChangesAsync();

                return Json(new { success = true, message = "Cập nhật ảnh thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Lỗi server: {ex.Message}" });
            }
        }

        //API lấy danh sách hình ảnh
        [HttpGet]
        public async Task<IActionResult> GetHinhAnh()
        {
            try
            {
                // Lấy MaChuSan từ API thay vì session
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");

                if (maChuSan == null)
                {
                    return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
                }

                var baiDang = dbContext.ThongTinBaiDangs.FirstOrDefault(x => x.MaChuSan == maChuSan);

                if (baiDang == null)
                {
                    //Tạo thông tin bài đăng mới 
                    // Lấy mã bài đăng lớn nhất hiện tại
                    var lastMaBaiDang = await dbContext.ThongTinBaiDangs
                        .OrderByDescending(x => x.MaBaiDang)
                        .Select(x => x.MaBaiDang)
                        .FirstOrDefaultAsync();

                    string newMaBaiDang = "BD001"; // Mặc định nếu chưa có bài đăng nào

                    if (!string.IsNullOrEmpty(lastMaBaiDang))
                    {
                        // Tách phần số phía sau "BD"
                        int number = int.Parse(lastMaBaiDang.Substring(2));
                        number++; // tăng lên 1
                        newMaBaiDang = "BD" + number.ToString("D3"); // định dạng về BD00x
                    }

                    // Tạo mới bài đăng
                    baiDang = new ThongTinBaiDang
                    {
                        MaBaiDang = newMaBaiDang,
                        GioMoCua = 6,
                        GioDongCua = 22,
                        MaChuSan = maChuSan
                    };

                    await dbContext.ThongTinBaiDangs.AddAsync(baiDang);
                    await dbContext.SaveChangesAsync();
                }

                var images = await dbContext.HinhAnhBaiDangs
                   .Where(x => x.MaBaiDang == baiDang.MaBaiDang)
                   .OrderBy(x => x.MaAnh)
                   .ToListAsync();

                // Nếu không có ảnh, tạo ảnh mặc định
                if (!images.Any())
                {
                    return Json(new { success = false, message = "Không có  hình ảnh để hiển thị!" });
                }

                // Định dạng danh sách ảnh trả về
                var result = images.Select((x, index) => new
                {
                    MaAnh = x.MaAnh,
                    ImgIndex = $"img{x.ThuTu}",
                    HinhAnh = Url.Content(x.HinhAnh.StartsWith("~/") ? x.HinhAnh : $"~{x.HinhAnh}")
                }).ToList();

                return Json(new { data = result, success = true });
            }
            catch (Exception)
            {

                return Json(new { success = false, message ="Lỗi sever!" });
            }
          
        }

        //API thay đổi giờ mở cửa và đóng cửa
        [HttpPost]
        public async Task<IActionResult> updateThoiGianMoCua([FromBody] UpdateTimeModel model)
        {
            try
            {
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                if (!maChuSan.HasValue)
                {
                    return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
                }

                // Xử lý mặc định nếu không có giá trị
                int gioMoCua = model.gioMoCua != 0 ? model.gioMoCua : 0;
                int gioDongCua = model.gioDongCua != 0 ? model.gioDongCua : 24;

                var thongtin = await dbContext.ThongTinBaiDangs.Where(tt => tt.MaChuSan == maChuSan).FirstOrDefaultAsync();

                if (thongtin == null)
                {
                    return Json(new { success = false, message = "Không có thông tin bài đăng hợp lệ!" });
                }

                thongtin.GioMoCua = gioMoCua;
                thongtin.GioDongCua = gioDongCua;

                await dbContext.SaveChangesAsync();

                return Json(new { success = true, message = "Cập nhật thành công!" });
            }
            catch (Exception)
            {

                return Json(new { success = false, message = "Lỗi server, vui lòng thử lại sau!" });
            }
        }

        //API get thời gian mở cửa và đóng cửa và số lượng sân
        [HttpGet]
        public async Task<IActionResult> GetThongTinBaiDangSan()
        {
            try
            {
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");
                if (!maChuSan.HasValue)
                {
                    return Json(new { success = false, message = "Bạn chưa đăng nhập!" });
                }

                var thongTin = await dbContext.ThongTinBaiDangs
                    .Where(x => x.MaChuSan == maChuSan)
                    .Select(x => new
                    {
                        x.GioMoCua,
                        x.GioDongCua
                    })
                    .FirstOrDefaultAsync();

                if (thongTin == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy thông tin sân!" });
                }
                // Đếm số lượng sân từ bảng SanBong
                int soLuongSan = await dbContext.SanBongs
                    .CountAsync(s => s.MaChuSan == maChuSan);

                return Json(new { success = true, data = new
                {
                    thongTin.GioMoCua,
                    thongTin.GioDongCua,
                    soLuongSan
                }});
            }
            catch (Exception)
            {
                return Json (new { success = false, message = "Lỗi server!"});
            }
        }
    }
}
