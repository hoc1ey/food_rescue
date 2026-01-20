using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using backend_dotnet.Data;
using backend_dotnet.Services;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Npgsql.NameTranslation; // <-- Necesario para el traductor

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
dataSourceBuilder.MapEnum<Days>("Days", new NpgsqlNullNameTranslator());
var dataSource = dataSourceBuilder.Build();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dataSource));

// Habilitar CORS para permitir peticiones desde Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();

builder.Services.AddTransient<UserService>();

var app = builder.Build();
app.UseCors("AllowAngular"); // Aplicar la política CORS

// --- INICIO: SEED DE DATOS (Crear ciudad por defecto) ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try 
    {
        var context = services.GetRequiredService<AppDbContext>();
        // Verificamos si la ciudad UIO existe, si no, la creamos.
        if (!context.Set<City>().Any(c => c.Code == "UIO"))
        {
            context.Set<City>().Add(new City { Code = "UIO", Name = "Quito" });
            context.SaveChanges();
            Console.WriteLine("✅ Datos semilla: Ciudad UIO creada exitosamente.");
        }
    }
    catch (Exception ex) { Console.WriteLine($"[Seed Error]: {ex.Message}"); }
}
// --- FIN: SEED DE DATOS ---

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