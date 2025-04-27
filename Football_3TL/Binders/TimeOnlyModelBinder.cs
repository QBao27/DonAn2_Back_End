using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Football_3TL.Binders
{
    public class TimeOnlyModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            if (valueProviderResult == ValueProviderResult.None)
                return Task.CompletedTask;

            var timeString = valueProviderResult.FirstValue;
            if (TimeOnly.TryParse(timeString, out var time))
            {
                bindingContext.Result = ModelBindingResult.Success(time);
            }
            else
            {
                bindingContext.ModelState.TryAddModelError(bindingContext.ModelName, "Giờ không hợp lệ (HH:mm).");
            }

            return Task.CompletedTask;
        }
    }
}
