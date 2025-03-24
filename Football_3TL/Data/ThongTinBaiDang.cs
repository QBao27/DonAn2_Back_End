using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class ThongTinBaiDang
{
    public string MaBaiDang { get; set; } = null!;

    public string? GioMoCua { get; set; }

    public int? MaChuSan { get; set; }

    public virtual ICollection<HinhAnhBaiDang> HinhAnhBaiDangs { get; set; } = new List<HinhAnhBaiDang>();

    public virtual ChuSan? MaChuSanNavigation { get; set; }
}
