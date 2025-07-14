namespace Football_3TL.Areas.Customer.Models
{
    public class SignUpPaymentModel
    {
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string SanBongName { get; set; }
        public string PassWord { get; set; }
        public string DiaChiTinh { get; set; }
        public string DiaChiHuyen { get; set; }
        public string DiaChiXa { get; set; }
        public string DiaChiCuThe { get; set; }
        public string MaGoi { get; set; } // ID gói dịch vụ
        public double SoTien { get; set; } // Tổng tiền 
    }

}
