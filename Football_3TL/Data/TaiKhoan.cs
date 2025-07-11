using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class TaiKhoan
{
    public int MaTaiKhoan { get; set; }

    public string? MatKhau { get; set; }

    public int? MaChuSan { get; set; }

    public int? Quyen { get; set; }

    public string? TrangThai { get; set; }

    public virtual ChuSan? MaChuSanNavigation { get; set; }
}
