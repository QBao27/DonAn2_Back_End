using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class KhuyenMai
{
    public int MaKm { get; set; }

    public string TenKm { get; set; } = null!;

    public decimal GiamGia { get; set; }

    public DateOnly NgayBd { get; set; }

    public DateOnly NgayKt { get; set; }

    public string TrangThai { get; set; } = null!;

    public int? MaChuSan { get; set; }

    public virtual ChuSan? MaChuSanNavigation { get; set; }
}
