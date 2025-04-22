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

        //[HttpPost]
        //public async Task<IActionResult> UploadImages([FromForm] List<IFormFile> files)
        //{
        //    try
        //    {
        //        // Lấy MaChuSan từ API thay vì session
        //        var maChuSan = HttpContext.Session.GetInt32("maChuSan");

        //        if (maChuSan == null)
        //        {
        //            return BadRequest(new { Message = "Không xác định được MaChuSan." });
        //        }

        //        var baiDang = dbContext.ThongTinBaiDangs.FirstOrDefault(x => x.MaChuSan == maChuSan);

        //        if (baiDang == null)
        //        {
        //            // Tạo mới MaBaiDang nếu chưa có bài đăng
        //            string maBaiDang = Guid.NewGuid().ToString();

        //            baiDang = new ThongTinBaiDang
        //            {
        //                MaBaiDang = maBaiDang,
        //                GioMoCua = "07:00 - 23:00",
        //                MaChuSan = maChuSan.Value
        //            };

        //            dbContext.ThongTinBaiDangs.Add(baiDang);
        //            await dbContext.SaveChangesAsync(); // Lưu bài đăng trước khi thêm ảnh
        //        }

        //        // Lấy danh sách ảnh hiện có của bài đăng
        //        var hinhAnhCu = dbContext.HinhAnhBaiDangs
        //                                 .Where(x => x.MaBaiDang == baiDang.MaBaiDang)
        //                                 .ToList();

        //        List<string> uploadedFiles = new List<string>();

        //        for (int i = 0; i < files.Count; i++)
        //        {
        //            var file = files[i];
        //            if (file != null && file.Length > 0)
        //            {
        //                string fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        //                string filePath = Path.Combine("wwwroot/Img", fileName);

        //                using (var stream = new FileStream(filePath, FileMode.Create))
        //                {
        //                    await file.CopyToAsync(stream);
        //                }

        //                string newFilePath = "/Img/" + fileName;

        //                if (i < hinhAnhCu.Count)
        //                {
        //                    // Cập nhật ảnh cũ
        //                    hinhAnhCu[i].HinhAnh = newFilePath;
        //                    dbContext.HinhAnhBaiDangs.Update(hinhAnhCu[i]);
        //                }
        //                else
        //                {
        //                    // Thêm ảnh mới nếu vượt quá số ảnh cũ
        //                    var hinhAnh = new HinhAnhBaiDang
        //                    {
        //                        MaBaiDang = baiDang.MaBaiDang,
        //                        HinhAnh = newFilePath
        //                    };
        //                    dbContext.HinhAnhBaiDangs.Add(hinhAnh);
        //                }

        //                uploadedFiles.Add(newFilePath);
        //            }
        //        }

        //        await dbContext.SaveChangesAsync();
        //        return Ok(new { Message = "Cập nhật ảnh thành công!", Files = uploadedFiles });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { Message = "Lỗi server", Error = ex.Message });
        //    }
        //}

        [HttpPost]
        public async Task<IActionResult> UploadImages([FromForm] List<IFormFile> files)
        {
            try
            {
                var maChuSan = HttpContext.Session.GetInt32("maChuSan");

                if (maChuSan == null)
                {
                    return BadRequest(new { Message = "Không xác định được MaChuSan." });
                }

                var baiDang = dbContext.ThongTinBaiDangs.FirstOrDefault(x => x.MaChuSan == maChuSan);

                if (baiDang == null)
                {
                    string maBaiDang = Guid.NewGuid().ToString();

                    baiDang = new ThongTinBaiDang
                    {
                        MaBaiDang = maBaiDang,
                        //chưa xong chổ này
                        GioMoCua = 7,
                        MaChuSan = maChuSan.Value
                    };

                    dbContext.ThongTinBaiDangs.Add(baiDang);
                    await dbContext.SaveChangesAsync();
                }

                var hinhAnhCu = dbContext.HinhAnhBaiDangs
                                          .Where(x => x.MaBaiDang == baiDang.MaBaiDang)
                                          .OrderBy(x => x.MaAnh) // Sắp xếp theo MaAnh để giữ thứ tự
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
                            // Cập nhật ảnh vào đúng MaAnh đã có
                            var hinhAnhCapNhat = hinhAnhCu[i];
                            hinhAnhCapNhat.HinhAnh = newFilePath;
                            dbContext.HinhAnhBaiDangs.Update(hinhAnhCapNhat);
                        }
                        else
                        {
                            // Nếu chưa có ảnh, thêm ảnh mới vào cuối
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
        public IActionResult GetMaChuSan()
        {
            var maChuSan = HttpContext.Session.GetInt32("maChuSan");
            return Ok(new { MaChuSan = maChuSan });
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
     .ToList()
     .Select((x, index) => new
     {
         Index = index + 1, // Thêm Index
         MaAnh = x.MaAnh,   // Thêm MaAnh vào danh sách trả về
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
