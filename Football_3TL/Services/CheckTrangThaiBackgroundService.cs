using Football_3TL.Data;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Services
{
    public class CheckTrangThaiBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public CheckTrangThaiBackgroundService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<Football3tlContext>();

                    var now = DateTime.Now;

                    var hetHan = await dbContext.ThongTinDangKies
                        .Where(x => x.TrangThai == "1" && x.NgayKt < now)
                        .ToListAsync();

                    foreach (var dk in hetHan)
                    {
                        dk.TrangThai = "2";
                        Console.WriteLine($"[BGService] MaDangKy: {dk.MaDangKy} => TrangThai = 2 (Hết hạn)");
                    }

                    await dbContext.SaveChangesAsync();
                    Console.WriteLine($"[BGService] Đã cập nhật {hetHan.Count} đăng ký hết hạn.");
                }

                // Lặp lại sau 5 phút
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
