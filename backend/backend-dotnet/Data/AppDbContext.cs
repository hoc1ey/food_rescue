using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend_dotnet.Models;

namespace backend_dotnet.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Donor> Donors { get; set; }
        public DbSet<Beneficiary> Beneficiaries { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Location> Locations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresEnum<UserType>();
            modelBuilder.HasPostgresEnum<Days>();

            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<User>().Property(u => u.Id).HasColumnName("id");
            modelBuilder.Entity<User>().Property(u => u.Email).HasColumnName("email");
            modelBuilder.Entity<User>().Property(u => u.Password).HasColumnName("password");
            modelBuilder.Entity<User>().Property(u => u.FirstName).HasColumnName("firstName");
            modelBuilder.Entity<User>().Property(u => u.LastName).HasColumnName("lastName");
            modelBuilder.Entity<User>().Property(u => u.UserType)
                .HasColumnName("userType")
                .HasColumnType("text");
            modelBuilder.Entity<User>().Property(u => u.CreatedAt).HasColumnName("createdAt");
            modelBuilder.Entity<User>().Property(u => u.UpdatedAt).HasColumnName("updatedAt");

            modelBuilder.Entity<Donor>().ToTable("Donor");
            modelBuilder.Entity<Donor>().Property(d => d.Id).HasColumnName("id");
            modelBuilder.Entity<Donor>().Property(d => d.UserId).HasColumnName("userId");

            modelBuilder.Entity<Beneficiary>().ToTable("Beneficiary");
            modelBuilder.Entity<Beneficiary>().Property(b => b.Id).HasColumnName("id");
            modelBuilder.Entity<Beneficiary>().Property(b => b.UserId).HasColumnName("userId");
            
            modelBuilder.Entity<Donor>()
                .HasOne(d => d.User)
                .WithOne(u => u.Donor)
                .HasForeignKey<Donor>(d => d.UserId);

            modelBuilder.Entity<Beneficiary>()
                .HasOne(b => b.User)
                .WithOne(u => u.Beneficiary)
                .HasForeignKey<Beneficiary>(b => b.UserId);
        }
    }
}