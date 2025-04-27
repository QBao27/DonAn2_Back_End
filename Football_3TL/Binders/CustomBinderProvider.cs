using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Football_3TL.Binders
{
    public class CustomBinderProvider : IModelBinderProvider
    {
        public IModelBinder? GetBinder(ModelBinderProviderContext context)
        {
            if (context.Metadata.ModelType == typeof(DateOnly) || context.Metadata.ModelType == typeof(DateOnly?))
            {
                return new BinderTypeModelBinder(typeof(DateOnlyModelBinder));
            }

            if (context.Metadata.ModelType == typeof(TimeOnly) || context.Metadata.ModelType == typeof(TimeOnly?))
            {
                return new BinderTypeModelBinder(typeof(TimeOnlyModelBinder));
            }

            return null;
        }
    }
}
