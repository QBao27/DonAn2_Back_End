using Football_3TL.Binders;
using Football_3TL.Data;
using Football_3TL.Services;
using Football_3TL.Services.Email;
using Football_3TL.Services.Vnpay;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Thêm session service
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // thời gian sống của session
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddControllersWithViews(options =>
{
    options.ModelBinderProviders.Insert(0, new CustomBinderProvider());
});

// Add services to the container.
builder.Services.AddControllersWithViews();

//Connect VNPay API
builder.Services.AddScoped<IVnPayService, VnPayService>();

// Connect EMail
builder.Services.AddScoped<IEmailService, EmailService>();

// Đăng ký BackgroundService
builder.Services.AddHostedService<CheckTrangThaiBackgroundService>();


//Đăng ký kết nối csdl
builder.Services.AddDbContext <Football3tlContext>(options => { options.UseSqlServer(builder.Configuration.GetConnectionString("ConnFB3TL")); });

//Đăng ký session
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Thời gian hết hạn session
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddHttpContextAccessor();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//kích hoạt session
app.UseSession();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "areas",
    pattern: "{area=Customer}/{controller=Home}/{action=Index}/{id?}"
); 
app.Run();
