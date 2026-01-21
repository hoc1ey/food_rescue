// C:/Users/Mateo/VSCodeProjects/awa/food_rescue/frontend/src/app/core/services/soap-registration.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistroUsuarioSoap {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  // Campos opcionales de ubicación (para Donantes)
  locationName?: string;
  locationMainStreet?: string;
  locationSecondaryStreet?: string;
  locationReference?: string;
  locationCityCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SoapRegistrationService {
  private http = inject(HttpClient);
  private soapUrl = 'http://localhost:5113/UserService.svc'; // Puerto de tu backend .NET

  registrarUsuario(datos: RegistroUsuarioSoap): Observable<string> {
    // Construir el envelope SOAP
    // Nota: Los campos dentro de <tem:request> deben ir en orden alfabético estricto
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
                  <tem:LocationCityCode>${datos.locationCityCode || 'UIO'}</tem:LocationCityCode>
                  <tem:LocationMainStreet>${datos.locationMainStreet || ''}</tem:LocationMainStreet>
                  <tem:LocationName>${datos.locationName || ''}</tem:LocationName>
                  <tem:LocationReference>${datos.locationReference || ''}</tem:LocationReference>
                  <tem:LocationSecondaryStreet>${datos.locationSecondaryStreet || ''}</tem:LocationSecondaryStreet>
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

    // Enviamos como texto porque recibiremos XML, no JSON
    return this.http.post(this.soapUrl, soapEnvelope, {
      headers,
      responseType: 'text'
    });
  }
}
