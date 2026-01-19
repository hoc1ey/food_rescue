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
dataSourceBuilder.MapEnum<UserType>();
dataSourceBuilder.MapEnum<Days>();
var dataSource = dataSourceBuilder.Build();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dataSource));

builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();

builder.Services.AddTransient<UserService>();

var app = builder.Build();

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