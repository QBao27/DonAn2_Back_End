using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class KhachHang
{
    public string MaKhachHang { get; set; } = null!;

    public string? HoVaTen { get; set; }

    public string? SoDienThoai { get; set; }

    public virtual ICollection<ThongTinDatSan> ThongTinDatSans { get; set; } = new List<ThongTinDatSan>();
}
