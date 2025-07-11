using System;
using System.Collections.Generic;

namespace Football_3TL.Data;

public partial class ChuSan
{
    public int MaChuSan { get; set; }

    public string? HoVaTen { get; set; }

    public string? SoDienThoai { get; set; }

    public string? Email { get; set; }

    public string? TenSanBong { get; set; }

    public string? Tinh { get; set; }

    public string? Huyen { get; set; }

    public string? Xa { get; set; }

    public string? DiaChi { get; set; }

    public int? MaKm { get; set; }

    public virtual ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

    public virtual ICollection<GiamGiaTheoGio> GiamGiaTheoGios { get; set; } = new List<GiamGiaTheoGio>();

    public virtual ICollection<LichSu> LichSus { get; set; } = new List<LichSu>();

    public virtual KhuyenMai? MaKmNavigation { get; set; }

    public virtual ICollection<SanBong> SanBongs { get; set; } = new List<SanBong>();

    public virtual ICollection<TaiKhoan> TaiKhoans { get; set; } = new List<TaiKhoan>();

    public virtual ICollection<ThongTinBaiDang> ThongTinBaiDangs { get; set; } = new List<ThongTinBaiDang>();

    public virtual ICollection<ThongTinDangKy> ThongTinDangKies { get; set; } = new List<ThongTinDangKy>();

    public virtual ICollection<ThongTinDatSan> ThongTinDatSans { get; set; } = new List<ThongTinDatSan>();
}
