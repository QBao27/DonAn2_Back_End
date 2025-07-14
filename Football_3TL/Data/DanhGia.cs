using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class DanhGia
{
    public int MaDanhGia { get; set; }

    public int? MaChuSan { get; set; }

    public string? HoTen { get; set; }

    public string? SoDienThoai { get; set; }

    public string? NoiDung { get; set; }

    public TimeOnly? ThoiGian { get; set; }

    public int? SoSao { get; set; }

    public string? Email { get; set; }

    public virtual ChuSan? MaChuSanNavigation { get; set; }
}
