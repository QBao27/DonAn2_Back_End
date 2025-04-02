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

        [HttpPost]
        public async Task<IActionResult> UploadImages([FromForm] List<IFormFile> files)
        {
            try
            {
                int maChuSan = 1; // Thay bằng cách lấy từ session nếu cần
                var baiDang = dbContext.ThongTinBaiDangs.FirstOrDefault(x => x.MaChuSan == maChuSan);

                if (baiDang == null)
                {
                    return NotFound(new { Message = "Không tìm thấy bài đăng." });
                }

                // Lấy danh sách ảnh hiện có của bài đăng
                var hinhAnhCu = dbContext.HinhAnhBaiDangs
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

                        if (i < hinhAnhCu.Count)
                        {
                            // Cập nhật ảnh cũ
                            hinhAnhCu[i].HinhAnh = newFilePath;
                            dbContext.HinhAnhBaiDangs.Update(hinhAnhCu[i]);
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

        [HttpGet]
        public IActionResult GetImages(int maChuSan)
        {
            Console.WriteLine($"🔍 Nhận được MaChuSan: {maChuSan}"); // Debug

            var baiDang = dbContext.ThongTinBaiDangs.FirstOrDefault(x => x.MaChuSan == maChuSan);

            if (baiDang == null)
            {
                Console.WriteLine($"❌ Không tìm thấy bài đăng với MaChuSan = {maChuSan}");
                return NotFound(new { Message = "Không tìm thấy bài đăng." });
            }

            var images = dbContext.HinhAnhBaiDangs
    .Where(x => x.MaBaiDang == baiDang.MaBaiDang)
    .OrderBy(x => x.MaAnh)
    .ToList()  // Chuyển dữ liệu vào bộ nhớ trước
    .Select((x, index) => new
    {
        ImgId = $"img{index + 1}",
        HinhAnh = Url.Content(x.HinhAnh.StartsWith("~/") ? x.HinhAnh : $"~{x.HinhAnh}")
    })
    .ToList();


            if (!images.Any())
            {
                Console.WriteLine($"⚠️ Không có hình ảnh nào cho MaBaiDang = {baiDang.MaBaiDang}");
                return NotFound(new { Message = "Không có hình ảnh nào." });
            }

            Console.WriteLine($"✅ Trả về {images.Count} ảnh.");
            return Ok(images);
        }


    }
}
