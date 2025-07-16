namespace Football_3TL.Areas.Customer.Models.Vnpay
{
    public class PaymentInformationModel
    {
        public string MaChuSan { get; set; }      // Mã chủ sân
        public string HoTenKH { get; set; }       // Họ tên khách hàng
        public string SoDienThoaiKH { get; set; } // Số điện thoại khách hàng
        public string NgayDat { get; set; }       // Ngày đặt sân
        public string GioDat { get; set; }        // Giờ đặt sân
        public double ThoiLuong { get; set; }     // Thời lượng thuê sân (theo giờ)
        public string GhiChu { get; set; }        // Ghi chú
        public string TenSan { get; set; }        // Tên sân
        public string MaSan { get; set; }         // Mã sân
        public decimal Amount { get; set; }        // Tổng thanh toán
        public string OrderType { get; set; }     // Loại đơn hàng (nếu có)
        public string OrderDescription { get; set; } // Mô tả đơn hàng (nếu có)

    }

}
