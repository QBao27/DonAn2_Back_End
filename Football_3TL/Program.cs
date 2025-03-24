using Football_3TL.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

//??ng ký chu?i k?t n?i CSDL
builder.Services.AddDbContext <Football3tlContext>(options => { options.UseSqlServer(builder.Configuration.GetConnectionString("ConnFB3TL")); });

builder.Services.AddHttpContextAccessor();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=HomeController1}/{action=Index}/{id?}");

app.Run();
