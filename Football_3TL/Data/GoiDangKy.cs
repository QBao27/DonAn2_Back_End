using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class GoiDangKy
{
    public int MaGoi { get; set; }

    public int ThoiHan { get; set; }

    public double Gia { get; set; }

    public virtual ICollection<LichSu> LichSus { get; set; } = new List<LichSu>();

    public virtual ICollection<ThongTinDangKy> ThongTinDangKies { get; set; } = new List<ThongTinDangKy>();
}
