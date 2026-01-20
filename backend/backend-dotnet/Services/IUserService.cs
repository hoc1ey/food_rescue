using CoreWCF;
using System.Threading.Tasks;
using backend_dotnet.Models;

namespace backend_dotnet.Services
{
    [ServiceContract(Namespace = "http://food-rescue.com")] 
    public interface IUserService
    {
        [OperationContract]
        Task<string> RegistrarUsuario(RegistroUsuarioRequest request);
    }
}