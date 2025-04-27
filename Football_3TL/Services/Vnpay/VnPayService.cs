using Football_3TL.Areas.Customer.Models.Vnpay;
using Football_3TL.Libraries;
using System.Net;
using System.Web;

namespace Football_3TL.Services.Vnpay
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;

        public VnPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreatePaymentUrl(PaymentInformationModel model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();
            var pay = new VnPayLibrary();

            // Gọi URL callback sau khi thanh toán
            var urlCallBack = _configuration["Vnpay:PaymentBackReturnUrl"];

            // Dữ liệu cơ bản
            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);

            // Đảm bảo amount là số nguyên, nhân 100 và làm tròn
            var amount = (int)Math.Round(model.Amount * 100);
            pay.AddRequestData("vnp_Amount", amount.ToString());

            // Thời gian tạo giao dịch
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));

            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);

            // Lấy địa chỉ IP từ HttpContext
            var ipAddr = pay.GetIpAddress(context);
            pay.AddRequestData("vnp_IpAddr", ipAddr);

            // Locale: vn hoặc en
            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);

            // Mã tham chiếu giao dịch
            pay.AddRequestData("vnp_TxnRef", tick);

            // Đảm bảo OrderType không null
            pay.AddRequestData("vnp_OrderType", string.IsNullOrEmpty(model.OrderType) ? "other" : model.OrderType);

            // Mã hóa thông tin đơn hàng
            var orderInfo = $"{model.HoTenKH} - {model.OrderDescription ?? ""} - {model.Amount} VNĐ";
            pay.AddRequestData("vnp_OrderInfo", Uri.EscapeDataString(orderInfo));

            // URL nhận kết quả thanh toán
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);


            // Tạo URL thanh toán
            var paymentUrl = pay.CreateRequestUrl(
                _configuration["Vnpay:BaseUrl"],
                _configuration["Vnpay:HashSecret"]
            );

            return paymentUrl;
        }



        public PaymentResponseModel PaymentExecute(IQueryCollection collections)
        {
            var pay = new VnPayLibrary();
            var response = pay.GetFullResponseData(collections, _configuration["Vnpay:HashSecret"]);

            return response;
        }

    }

}
