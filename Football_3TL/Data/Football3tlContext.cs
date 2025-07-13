using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Football_3TL.Data;

public partial class Football3tlContext : DbContext
{
    public Football3tlContext()
    {
    }

    public Football3tlContext(DbContextOptions<Football3tlContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ChuSan> ChuSans { get; set; }

    public virtual DbSet<DanhGia> DanhGia { get; set; }

    public virtual DbSet<GiamGiaTheoGio> GiamGiaTheoGios { get; set; }

    public virtual DbSet<GoiDangKy> GoiDangKies { get; set; }

    public virtual DbSet<HinhAnhBaiDang> HinhAnhBaiDangs { get; set; }

    public virtual DbSet<HoaDon> HoaDons { get; set; }

    public virtual DbSet<KhachHang> KhachHangs { get; set; }

    public virtual DbSet<KhuyenMai> KhuyenMais { get; set; }

    public virtual DbSet<LichSu> LichSus { get; set; }

    public virtual DbSet<SanBong> SanBongs { get; set; }

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }

    public virtual DbSet<TaiKhoanOtp> TaiKhoanOtps { get; set; }

    public virtual DbSet<ThongTinBaiDang> ThongTinBaiDangs { get; set; }

    public virtual DbSet<ThongTinDangKy> ThongTinDangKies { get; set; }

    public virtual DbSet<ThongTinDatSan> ThongTinDatSans { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=LAPTOP-VC5IF5QK;Initial Catalog=Football_3TL;Integrated Security=True;Encrypt=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChuSan>(entity =>
        {
            entity.HasKey(e => e.MaChuSan).HasName("PK__ChuSan__D062237EB72E95E5");

            entity.ToTable("ChuSan");

            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.HoVaTen).HasMaxLength(255);
            entity.Property(e => e.Huyen).HasMaxLength(100);
            entity.Property(e => e.MaKm).HasColumnName("MaKM");
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);
            entity.Property(e => e.TenSanBong).HasMaxLength(255);
            entity.Property(e => e.Tinh).HasMaxLength(100);
            entity.Property(e => e.Xa).HasMaxLength(100);

            entity.HasOne(d => d.MaKmNavigation).WithMany(p => p.ChuSans)
                .HasForeignKey(d => d.MaKm)
                .HasConstraintName("FK_ChuSan_KhuyenMai");
        });

        modelBuilder.Entity<DanhGia>(entity =>
        {
            entity.HasKey(e => e.MaDanhGia).HasName("PK__DanhGia__AA9515BFA056A6E9");

            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.HoTen).HasMaxLength(255);
            entity.Property(e => e.NoiDung).HasMaxLength(255);
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.DanhGia)
                .HasForeignKey(d => d.MaChuSan)
                .HasConstraintName("FK__DanhGia__MaChuSa__4D94879B");
        });

        modelBuilder.Entity<GiamGiaTheoGio>(entity =>
        {
            entity.HasKey(e => e.MaGiamGia).HasName("PK__GiamGiaT__EF9458E411F62B4C");

            entity.ToTable("GiamGiaTheoGio");

            entity.Property(e => e.GiamGia).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.GioBd).HasColumnName("GioBD");
            entity.Property(e => e.GioKt).HasColumnName("GioKT");

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.GiamGiaTheoGios)
                .HasForeignKey(d => d.MaChuSan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GiamGiaTheoGio_ChuSan");
        });

        modelBuilder.Entity<GoiDangKy>(entity =>
        {
            entity.HasKey(e => e.MaGoi).HasName("PK__GoiDangK__3CD30F691E93B2D1");

            entity.ToTable("GoiDangKy");
        });

        modelBuilder.Entity<HinhAnhBaiDang>(entity =>
        {
            entity.HasKey(e => e.MaAnh).HasName("PK__HinhAnhB__356240DF0575F9BE");

            entity.ToTable("HinhAnhBaiDang");

            entity.Property(e => e.HinhAnh).HasMaxLength(255);
            entity.Property(e => e.MaBaiDang).HasMaxLength(50);

            entity.HasOne(d => d.MaBaiDangNavigation).WithMany(p => p.HinhAnhBaiDangs)
                .HasForeignKey(d => d.MaBaiDang)
                .HasConstraintName("FK__HinhAnhBa__MaBai__412EB0B6");
        });

        modelBuilder.Entity<HoaDon>(entity =>
        {
            entity.HasKey(e => e.MaHoaDon).HasName("PK__HoaDon__835ED13BD61858A8");

            entity.ToTable("HoaDon");

            entity.HasOne(d => d.MaDatSanNavigation).WithMany(p => p.HoaDons)
                .HasForeignKey(d => d.MaDatSan)
                .HasConstraintName("FK__HoaDon__MaDatSan__4AB81AF0");
        });

        modelBuilder.Entity<KhachHang>(entity =>
        {
            entity.HasKey(e => e.MaKhachHang).HasName("PK__KhachHan__88D2F0E53E713737");

            entity.ToTable("KhachHang");

            entity.Property(e => e.MaKhachHang).HasMaxLength(50);
            entity.Property(e => e.HoVaTen).HasMaxLength(255);
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);
        });

        modelBuilder.Entity<KhuyenMai>(entity =>
        {
            entity.HasKey(e => e.MaKm).HasName("PK__KhuyenMa__2725CF15DFF66319");

            entity.ToTable("KhuyenMai");

            entity.Property(e => e.MaKm).HasColumnName("MaKM");
            entity.Property(e => e.GiamGia).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.NgayBd).HasColumnName("NgayBD");
            entity.Property(e => e.NgayKt).HasColumnName("NgayKT");
            entity.Property(e => e.TenKm)
                .HasMaxLength(100)
                .HasColumnName("TenKM");
            entity.Property(e => e.TrangThai).HasMaxLength(50);
        });

        modelBuilder.Entity<LichSu>(entity =>
        {
            entity.HasKey(e => e.MaLichSu).HasName("PK__LichSu__C443222A72AC7773");

            entity.ToTable("LichSu");

            entity.Property(e => e.ThoiGian)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TongThanhToan).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.LichSus)
                .HasForeignKey(d => d.MaChuSan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LichSu_ChuSan");

            entity.HasOne(d => d.MaGoiNavigation).WithMany(p => p.LichSus)
                .HasForeignKey(d => d.MaGoi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LichSu_GoiDangKy");
        });

        modelBuilder.Entity<SanBong>(entity =>
        {
            entity.HasKey(e => e.MaSan).HasName("PK__SanBong__3188C8267AEBC75D");

            entity.ToTable("SanBong");

            entity.Property(e => e.LoaiSan).HasMaxLength(50);
            entity.Property(e => e.TenSan).HasMaxLength(255);

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.SanBongs)
                .HasForeignKey(d => d.MaChuSan)
                .HasConstraintName("FK__SanBong__MaChuSa__3B75D760");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.MaTaiKhoan).HasName("PK__TaiKhoan__AD7C6529D080CF34");

            entity.ToTable("TaiKhoan");

            entity.Property(e => e.MatKhau).HasMaxLength(255);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .IsUnicode(false);

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.TaiKhoans)
                .HasForeignKey(d => d.MaChuSan)
                .HasConstraintName("FK_TaiKhoan_ChuSan");
        });

        modelBuilder.Entity<TaiKhoanOtp>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TaiKhoan__3214EC07E413BDDB");

            entity.ToTable("TaiKhoan_OTP");

            entity.Property(e => e.Hsd)
                .HasColumnType("datetime")
                .HasColumnName("HSD");
            entity.Property(e => e.Otp)
                .HasMaxLength(6)
                .HasColumnName("OTP");

            entity.HasOne(d => d.MaTaiKhoanNavigation).WithMany(p => p.TaiKhoanOtps)
                .HasForeignKey(d => d.MaTaiKhoan)
                .HasConstraintName("FK__TaiKhoan___MaTai__160F4887");
        });

        modelBuilder.Entity<ThongTinBaiDang>(entity =>
        {
            entity.HasKey(e => e.MaBaiDang).HasName("PK__ThongTin__BF5D50C5BAE947C1");

            entity.ToTable("ThongTinBaiDang");

            entity.Property(e => e.MaBaiDang).HasMaxLength(50);

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.ThongTinBaiDangs)
                .HasForeignKey(d => d.MaChuSan)
                .HasConstraintName("FK__ThongTinB__MaChu__3E52440B");
        });

        modelBuilder.Entity<ThongTinDangKy>(entity =>
        {
            entity.HasKey(e => e.MaDangKy).HasName("PK__ThongTin__BA90F02D41CA4E07");

            entity.ToTable("ThongTinDangKy");

            entity.Property(e => e.NgayBd)
                .HasColumnType("datetime")
                .HasColumnName("NgayBD");
            entity.Property(e => e.NgayKt)
                .HasColumnType("datetime")
                .HasColumnName("NgayKT");
            entity.Property(e => e.TrangThai).HasMaxLength(50);

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.ThongTinDangKies)
                .HasForeignKey(d => d.MaChuSan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ThongTinDangKy_ChuSan");

            entity.HasOne(d => d.MaGoiNavigation).WithMany(p => p.ThongTinDangKies)
                .HasForeignKey(d => d.MaGoi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ThongTinDangKy_GoiDangKy");
        });

        modelBuilder.Entity<ThongTinDatSan>(entity =>
        {
            entity.HasKey(e => e.MaDatSan).HasName("PK__ThongTin__747DC2D394DC419E");

            entity.ToTable("ThongTinDatSan");

            entity.Property(e => e.GhiChu).HasMaxLength(255);
            entity.Property(e => e.MaKhachHang).HasMaxLength(50);
            entity.Property(e => e.TenSan).HasMaxLength(255);
            entity.Property(e => e.TongThanhToan).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TrangThaiSan).HasMaxLength(50);
            entity.Property(e => e.TrangThaiThanhToan).HasMaxLength(50);

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.ThongTinDatSans)
                .HasForeignKey(d => d.MaChuSan)
                .HasConstraintName("FK__ThongTinD__MaChu__46E78A0C");

            entity.HasOne(d => d.MaKhachHangNavigation).WithMany(p => p.ThongTinDatSans)
                .HasForeignKey(d => d.MaKhachHang)
                .HasConstraintName("FK__ThongTinD__MaKha__45F365D3");

            entity.HasOne(d => d.MaSanNavigation).WithMany(p => p.ThongTinDatSans)
                .HasForeignKey(d => d.MaSan)
                .HasConstraintName("FK__ThongTinD__MaSan__47DBAE45");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
