using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class ThongTinDatSan
{
    public int MaDatSan { get; set; }

    public string? MaKhachHang { get; set; }

    public int? MaChuSan { get; set; }

    public DateOnly? ThoiGianDat { get; set; }

    public DateOnly? NgayDat { get; set; }

    public TimeOnly? GioDat { get; set; }

    public int? ThoiLuong { get; set; }

    public string? GhiChu { get; set; }

    public string? TenSan { get; set; }

    public int? MaSan { get; set; }

    public string? TrangThaiThanhToan { get; set; }

    public string? TrangThaiSan { get; set; }

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual ChuSan? MaChuSanNavigation { get; set; }

    public virtual KhachHang? MaKhachHangNavigation { get; set; }

    public virtual SanBong? MaSanNavigation { get; set; }
}
