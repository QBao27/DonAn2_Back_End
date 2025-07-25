﻿namespace Football_3TL.Areas.Customer.Models.Vnpay
{
    public class PaymentResponseModel
    {
        public string OrderDescription { get; set; }
        public string TransactionId { get; set; }
        public string OrderId { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentId { get; set; }
        public bool Success { get; set; }
        public string Token { get; set; }
        public string VnPayResponseCode { get; set; }
        public string VnPayTransactionNo { get; set; }
        public string VnPayOrderId { get; set; }
        public decimal Amount { get; set; }
        public string MaGoi { get; set; }
        public string FullName { get; set; }
        public string Message { get; set; }

    }

}
