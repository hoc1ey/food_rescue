using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using backend_dotnet.Data;
using backend_dotnet.Services;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
var dataSource = dataSourceBuilder.Build();

// Habilitar CORS para permitir peticiones desde Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dataSource));

builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();

builder.Services.AddTransient<UserService>();

var app = builder.Build();
app.UseRouting(); // <-- IMPORTANTE: Agregar esto antes de CORS
app.UseCors("AllowAngular"); // Aplicar la política CORS

app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder.AddService<UserService>();
    serviceBuilder.AddServiceEndpoint<UserService, IUserService>(
        new BasicHttpBinding(),
        "/UserService.svc");

    var behavior = app.Services.GetRequiredService<ServiceMetadataBehavior>();
    behavior.HttpGetEnabled = true;
});

app.Run();