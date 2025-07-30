namespace Football_3TL.Areas.ChuSanBong.Models
{
    public class modelQuanLyDatSan
    {
        public string? TenSan {  get; set; }
        public string? LoaiSan { get; set; }
        public double? GiaSan { get; set; }
        public string? TrangThai { get; set; }
        public string? TrangThaiThanhToan { get; set; }
        public int? MaDatSan { get; set; }
        public int? MaSan { get; set; }
        public double? giaGoc { get; set; }
        public bool ApDungGiamGia { get; internal set; }
    }
}
