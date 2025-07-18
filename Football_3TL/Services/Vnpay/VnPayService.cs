using Football_3TL.Areas.ChuSanBong.Models;
using Football_3TL.Areas.Customer.Models;
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


        public string CreateDangKyPaymentUrl(SignUpPaymentModel model, HttpContext context)
        {
 
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();


            var pay = new VnPayLibrary();

            var urlCallBack = _configuration["Vnpay:DangKyReturnUrl"];


            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);

            var amount = (int)Math.Round(model.SoTien * 100);
            pay.AddRequestData("vnp_Amount", amount.ToString());

            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));

            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);


            var ipAddr = pay.GetIpAddress(context);
            pay.AddRequestData("vnp_IpAddr", ipAddr);


            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);


            pay.AddRequestData("vnp_TxnRef", tick);

            pay.AddRequestData("vnp_OrderType", "other");


            var orderInfo = $"Thanh toán đăng ký gói {model.MaGoi} - {model.FullName} - {model.Phone} - {model.Email}";
            pay.AddRequestData("vnp_OrderInfo", Uri.EscapeDataString(orderInfo));

            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);


            var paymentUrl = pay.CreateRequestUrl(
                _configuration["Vnpay:BaseUrl"],
                _configuration["Vnpay:HashSecret"]
            );

            return paymentUrl;
        }

        public string CreateGiaHanPaymentUrl(ModalGiaHan model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();
            var pay = new VnPayLibrary();

            // URL callback sau khi thanh toán gia hạn
            var urlCallBack = _configuration["Vnpay:GiaHanReturnUrl"];

            // Dữ liệu cơ bản
            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);

            // Số tiền thanh toán: nhân 100 theo yêu cầu VNPAY
            var amount = (int)Math.Round(model.Gia * 100);
            pay.AddRequestData("vnp_Amount", amount.ToString());

            // Thời gian tạo giao dịch
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));

            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);

            // Lấy IP từ context
            var ipAddr = pay.GetIpAddress(context);
            pay.AddRequestData("vnp_IpAddr", ipAddr);

            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);

            pay.AddRequestData("vnp_TxnRef", tick);

            // OrderType: có thể đặt cố định cho gia hạn
            pay.AddRequestData("vnp_OrderType", "renew");

            // OrderInfo: mô tả
            var orderInfo = $"Gia hạn gói {model.MaGoi} - Chủ sân {model.MaChuSan} - {model.ThoiHan} tháng - {model.Gia} VNĐ";
            pay.AddRequestData("vnp_OrderInfo", Uri.EscapeDataString(orderInfo));

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

            // Kiểm tra vnp_ResponseCode ở đây
            if (response.VnPayResponseCode == "00")
            {
                response.Success = true;
            }
            else
            {
                response.Success = false;
            }

            return response;
        }

        


    }

}
