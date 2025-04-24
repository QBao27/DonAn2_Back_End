using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class HinhAnhBaiDang
{
    public int MaAnh { get; set; }

    public string? MaBaiDang { get; set; }

    public string? HinhAnh { get; set; }
    public int? ThuTu { get; set; }

    public virtual ThongTinBaiDang? MaBaiDangNavigation { get; set; }
}
