namespace Football_3TL.Areas.Customer.Models.Vnpay
{
    public class DangKyPaymentResponseModel
    {
        public bool Success { get; set; }
        public string VnPayResponseCode { get; set; }
        public string VnPayTransactionNo { get; set; }
        public string VnPayOrderId { get; set; }
        public decimal Amount { get; set; }
        public string MaGoi { get; set; }
        public string FullName { get; set; }
        public string Message { get; set; }
    }
}
