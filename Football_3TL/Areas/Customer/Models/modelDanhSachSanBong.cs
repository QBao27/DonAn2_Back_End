namespace Football_3TL.Areas.Customer.Models
{
    public class modelDanhSachSanBong
    {
        public int MaChuSan { get; set; }
        public string? TenSanBong { get; set; }
        public string? Huyen { get; set; }
        public string? Tinh { get; set; }
        public int SoSanBong { get; set; }
        public string? MaBaiDang { get; set; }
        public string? AnhBaiDang { get; set; }

        public double SoSaoTB { get; set; }
        public int SoDanhGia { get; set; }
    }
}
