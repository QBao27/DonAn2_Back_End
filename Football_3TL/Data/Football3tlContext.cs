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

    public virtual DbSet<HinhAnhBaiDang> HinhAnhBaiDangs { get; set; }

    public virtual DbSet<HoaDon> HoaDons { get; set; }

    public virtual DbSet<KhachHang> KhachHangs { get; set; }

    public virtual DbSet<SanBong> SanBongs { get; set; }

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }

    public virtual DbSet<ThongTinBaiDang> ThongTinBaiDangs { get; set; }

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
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);
            entity.Property(e => e.TenSanBong).HasMaxLength(255);
            entity.Property(e => e.Tinh).HasMaxLength(100);
            entity.Property(e => e.Xa).HasMaxLength(100);
        });

        modelBuilder.Entity<DanhGia>(entity =>
        {
            entity.HasKey(e => e.MaDanhGia).HasName("PK__DanhGia__AA9515BFA056A6E9");

            entity.Property(e => e.HoTen).HasMaxLength(255);
            entity.Property(e => e.NoiDung).HasMaxLength(255);
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.DanhGia)
                .HasForeignKey(d => d.MaChuSan)
                .HasConstraintName("FK__DanhGia__MaChuSa__4D94879B");
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

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.TaiKhoans)
                .HasForeignKey(d => d.MaChuSan)
                .HasConstraintName("FK_TaiKhoan_ChuSan");
        });

        modelBuilder.Entity<ThongTinBaiDang>(entity =>
        {
            entity.HasKey(e => e.MaBaiDang).HasName("PK__ThongTin__BF5D50C5BAE947C1");

            entity.ToTable("ThongTinBaiDang");

            entity.Property(e => e.MaBaiDang).HasMaxLength(50);
            entity.Property(e => e.GioMoCua).HasMaxLength(50);

            entity.HasOne(d => d.MaChuSanNavigation).WithMany(p => p.ThongTinBaiDangs)
                .HasForeignKey(d => d.MaChuSan)
                .HasConstraintName("FK__ThongTinB__MaChu__3E52440B");
        });

        modelBuilder.Entity<ThongTinDatSan>(entity =>
        {
            entity.HasKey(e => e.MaDatSan).HasName("PK__ThongTin__747DC2D394DC419E");

            entity.ToTable("ThongTinDatSan");

            entity.Property(e => e.GhiChu).HasMaxLength(255);
            entity.Property(e => e.MaKhachHang).HasMaxLength(50);
            entity.Property(e => e.TenSan).HasMaxLength(255);
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
