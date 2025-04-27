using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Football_3TL.Binders
{
    public class DateOnlyModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            if (valueProviderResult == ValueProviderResult.None)
                return Task.CompletedTask;

            var dateString = valueProviderResult.FirstValue;
            if (DateOnly.TryParse(dateString, out var date))
            {
                bindingContext.Result = ModelBindingResult.Success(date);
            }
            else
            {
                bindingContext.ModelState.TryAddModelError(bindingContext.ModelName, "Ngày không hợp lệ (yyyy-MM-dd).");
            }

            return Task.CompletedTask;
        }
    }
}
