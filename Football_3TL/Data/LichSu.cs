using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class LichSu
{
    public int MaLichSu { get; set; }

    public int MaChuSan { get; set; }

    public int MaGoi { get; set; }

    public decimal TongThanhToan { get; set; }

    public DateTime? ThoiGian { get; set; }

    public virtual ChuSan MaChuSanNavigation { get; set; } = null!;

    public virtual GoiDangKy MaGoiNavigation { get; set; } = null!;
}
