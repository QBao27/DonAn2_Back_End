using Football_3TL.Areas.ChuSanBong.Models;
using Football_3TL.Areas.Customer.Models;
using Football_3TL.Areas.Customer.Models.Vnpay;

namespace Football_3TL.Services.Vnpay
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(PaymentInformationModel model, HttpContext context);

        string CreateDangKyPaymentUrl(SignUpPaymentModel model, HttpContext context);

        string CreateGiaHanPaymentUrl(ModalGiaHan model, HttpContext context);
        PaymentResponseModel PaymentExecute(IQueryCollection collections);

    }
}
