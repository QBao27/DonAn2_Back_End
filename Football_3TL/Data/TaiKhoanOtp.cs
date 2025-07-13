using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class TaiKhoanOtp
{
    public int Id { get; set; }

    public int? MaTaiKhoan { get; set; }

    public string Otp { get; set; } = null!;

    public DateTime Hsd { get; set; }

    public virtual TaiKhoan? MaTaiKhoanNavigation { get; set; }
}
