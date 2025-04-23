using Football_3TL.Areas.ChuSanBong.Models;
using Football_3TL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

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
        public async Task<IActionResult> UploadImages([FromForm] List<IFormFile> files)
        {
            try
            {
                // Lấy MaChuSan từ API thay vì session
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");

                if (maChuSan == null)
                {
                    return Json (new { success = false, message = "Bạn chưa đăng nhập!" });
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

                // Lấy danh sách ảnh hiện có của bài đăng
                var hinhAnhBaiDang = dbContext.HinhAnhBaiDangs
                                         .Where(x => x.MaBaiDang == baiDang.MaBaiDang)
                                         .ToList();

                List<string> uploadedFiles = new List<string>();

                for (int i = 0; i < files.Count; i++)
                {
                    var file = files[i];
                    if (file != null && file.Length > 0)
                    {
                        string fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                        string filePath = Path.Combine("wwwroot/Img", fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        string newFilePath = "/Img/" + fileName;

                        if (i < hinhAnhBaiDang.Count)
                        {
                            // Cập nhật ảnh cũ
                            hinhAnhBaiDang[i].HinhAnh = newFilePath;
                            dbContext.HinhAnhBaiDangs.Update(hinhAnhBaiDang[i]);
                        }
                        else
                        {
                            // Thêm ảnh mới nếu vượt quá số ảnh cũ
                            var hinhAnh = new HinhAnhBaiDang
                            {
                                MaBaiDang = baiDang.MaBaiDang,
                                HinhAnh = newFilePath
                            };
                            dbContext.HinhAnhBaiDangs.Add(hinhAnh);
                        }

                        uploadedFiles.Add(newFilePath);
                    }
                }

                await dbContext.SaveChangesAsync();
                return Ok(new { Message = "Cập nhật ảnh thành công!", Files = uploadedFiles });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Lỗi server", Error = ex.Message });
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
                    Index = index + 1,
                    MaAnh = x.MaAnh,
                    ImgId = $"img{index + 1}",
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
