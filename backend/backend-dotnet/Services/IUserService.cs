using CoreWCF;

namespace backend_dotnet.Services
{
    [ServiceContract(Namespace = "http://food-rescue.com")] 
    public interface IUserService
    {
        [OperationContract]
        string RegistrarUsuario(RegistroUsuarioRequest request);
    }
}