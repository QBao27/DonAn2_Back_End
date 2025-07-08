using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class ThongTinDangKy
{
    public int MaDangKy { get; set; }

    public int MaChuSan { get; set; }

    public int MaGoi { get; set; }

    public DateTime NgayBd { get; set; }

    public DateTime NgayKt { get; set; }

    public string TrangThai { get; set; } = null!;

    public virtual ChuSan MaChuSanNavigation { get; set; } = null!;

    public virtual GoiDangKy MaGoiNavigation { get; set; } = null!;
}
