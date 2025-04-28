namespace Football_3TL.Areas.Customer.Models
{
    public class ThongTinDatSanTam
    {
            public int MaChuSan { get; set; }
            public DateOnly NgayDat { get; set; }
            public TimeOnly GioDat { get; set; }
            public int ThoiLuong { get; set; }
            public int MaSan { get; set; }
            public string TenSan { get; set; }
            public string GhiChu { get; set; }

            public string HoTenKH { get; set; }   // thêm
            public string SoDienThoaiKH { get; set; } // thêm
    }
}
