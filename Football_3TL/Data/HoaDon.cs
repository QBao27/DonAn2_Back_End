using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class HoaDon
{
    public int MaHoaDon { get; set; }

    public int? MaDatSan { get; set; }

    public DateOnly? ThoiGian { get; set; }

    public virtual ThongTinDatSan? MaDatSanNavigation { get; set; }
}
