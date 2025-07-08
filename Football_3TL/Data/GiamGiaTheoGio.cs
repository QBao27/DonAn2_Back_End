using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class GiamGiaTheoGio
{
    public int MaGiamGia { get; set; }

    public int MaChuSan { get; set; }

    public decimal GiamGia { get; set; }

    public TimeOnly GioBd { get; set; }

    public TimeOnly GioKt { get; set; }

    public virtual ChuSan MaChuSanNavigation { get; set; } = null!;
}
