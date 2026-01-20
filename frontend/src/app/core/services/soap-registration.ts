import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RegistroUsuarioSoap {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  locationName: string;
  locationMainStreet: string;
  locationSecondaryStreet: string;
  locationReference: string;
  locationCityCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class SoapRegistrationService {
  private http = inject(HttpClient);
  // ⚠️ IMPORTANTE: Revisa la consola de 'dotnet run' para ver el puerto real (ej. 5000, 5123, etc.)
  private soapUrl = 'http://localhost:5113/UserService.svc';

  registrarUsuario(datos: RegistroUsuarioSoap): Observable<string> {
    // Construir el envelope SOAP
    const soapEnvelope = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                     xmlns:tem="http://food-rescue.com">
        <soap:Header/>
        <soap:Body>
          <tem:RegistrarUsuario>
            <tem:request>
              <tem:Email>${datos.email}</tem:Email>
              <tem:FirstName>${datos.firstName}</tem:FirstName>
              <tem:LastName>${datos.lastName}</tem:LastName>
              <tem:LocationCityCode>${datos.locationCityCode}</tem:LocationCityCode>
              <tem:LocationMainStreet>${datos.locationMainStreet}</tem:LocationMainStreet>
              <tem:LocationName>${datos.locationName}</tem:LocationName>
              <tem:LocationReference>${datos.locationReference}</tem:LocationReference>
              <tem:LocationSecondaryStreet>${datos.locationSecondaryStreet}</tem:LocationSecondaryStreet>
              <tem:Password>${datos.password}</tem:Password>
              <tem:UserType>${datos.userType}</tem:UserType>
            </tem:request>
          </tem:RegistrarUsuario>
        </soap:Body>
      </soap:Envelope>
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'SOAPAction': 'http://food-rescue.com/IUserService/RegistrarUsuario'
    });

    return this.http.post(this.soapUrl, soapEnvelope, {
      headers,
      responseType: 'text'
    }).pipe(
      map((responseXml: string) => {
        // Parsear la respuesta XML para sacar solo el mensaje
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseXml, 'text/xml');
        const result = xmlDoc.getElementsByTagName('RegistrarUsuarioResult')[0];
        return result ? (result.textContent || '') : 'Respuesta vacía del servidor';
      })
    );
  }
}
