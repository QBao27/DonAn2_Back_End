using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class SanBong
{
    public int MaSan { get; set; }

    public string? TenSan { get; set; }

    public string? LoaiSan { get; set; }

    public double? Gia { get; set; }

    public int? MaChuSan { get; set; }

    public virtual ChuSan? MaChuSanNavigation { get; set; }

    public virtual ICollection<ThongTinDatSan> ThongTinDatSans { get; set; } = new List<ThongTinDatSan>();
}
