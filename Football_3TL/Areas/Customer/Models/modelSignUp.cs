﻿namespace Football_3TL.Areas.Customer.Models
{
    public class modelSignUp
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string NameSanBong { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string Province { get; set; }
        public string District { get; set; }
        public string Communes { get; set; }
        public string PecificAddress { get; set; }
        public string MaGoi { get; set; } // ID gói dịch vụ
        public double SoTien { get; set; } // Tổng tiền 
    }
}
