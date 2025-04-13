namespace Football_3TL.Areas.ChuSanBong.Models
{
    public class modelThongTinDatSan
    {
        public string? hoTenKH {  get; set; }
        public string? soDienThoaiKH { get; set; }
        public DateOnly? NgayDat { get; set; }
        public TimeOnly? GioDat { get; set; }
        public int? ThoiLuong { get; set; }
        public string? GhiChu { get; set; }
        public string? TenSan { get; set; }
        public int? MaSan { get; set; }
    }
}
