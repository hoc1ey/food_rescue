import { UserType } from '../../generated/prisma/index.js';

export const getUsersData = (hashedPassword: string) => ({
  donors: [
    {
      email: 'donor1@example.com',
      password: hashedPassword,
      firstName: 'Juan',
      lastName: 'Pérez',
      userType: UserType.DONOR,
      location: {
        name: 'Panadería El Sol',
        mainStreet: 'Av. Amazonas',
        secondaryStreet: 'Calle Colón',
        reference: 'Junto al parque La Carolina',
        cityCode: 'UIO'
      }
    },
    {
      email: 'donor2@example.com',
      password: hashedPassword,
      firstName: 'María',
      lastName: 'González',
      userType: UserType.DONOR,
      location: {
        name: 'Restaurante La Costa',
        mainStreet: 'Malecón 2000',
        secondaryStreet: 'Calle 10 de Agosto',
        reference: 'Frente al río Guayas',
        cityCode: 'GYE'
      }
    },
    {
      email: 'donor3@example.com',
      password: hashedPassword,
      firstName: 'Carlos',
      lastName: 'Morales',
      userType: UserType.DONOR,
      location: {
        name: 'Supermercado Los Andes',
        mainStreet: 'Av. Loja',
        secondaryStreet: 'Calle Bolívar',
        reference: 'Centro comercial El Vergel',
        cityCode: 'CUE'
      }
    },
    {
      email: 'donor4@example.com',
      password: hashedPassword,
      firstName: 'Andrea',
      lastName: 'Salazar',
      userType: UserType.DONOR,
      location: {
        name: 'Cafetería Puerto Rico',
        mainStreet: 'Av. 24 de Mayo',
        secondaryStreet: 'Calle 13',
        reference: 'Plaza cívica',
        cityCode: 'MEC'
      }
    }
  ],
  beneficiaries: [
    {
      email: 'beneficiary1@example.com',
      password: hashedPassword,
      firstName: 'Ana',
      lastName: 'Ramírez',
      userType: UserType.BENEFICIARY,
      foundation: {
        name: 'Fundación Ayuda Social Quito',
        mainStreet: 'Av. 6 de Diciembre',
        secondaryStreet: 'Calle Patria',
        reference: 'Edificio azul, planta baja',
        cityCode: 'UIO'
      }
    },
    {
      email: 'beneficiary2@example.com',
      password: hashedPassword,
      firstName: 'Luis',
      lastName: 'Torres',
      userType: UserType.BENEFICIARY,
      foundation: {
        name: 'Fundación Esperanza Guayaquil',
        mainStreet: 'Av. 9 de Octubre',
        secondaryStreet: 'Calle Pichincha',
        reference: 'Cerca del mercado central',
        cityCode: 'GYE'
      }
    },
    {
      email: 'beneficiary3@example.com',
      password: hashedPassword,
      firstName: 'Patricia',
      lastName: 'Vega',
      userType: UserType.BENEFICIARY,
      foundation: {
        name: 'Hogar de Niños Cuenca',
        mainStreet: 'Av. España',
        secondaryStreet: 'Calle Hermano Miguel',
        reference: 'Junto al parque de la madre',
        cityCode: 'CUE'
      }
    },
    {
      email: 'beneficiary4@example.com',
      password: hashedPassword,
      firstName: 'Roberto',
      lastName: 'Mendoza',
      userType: UserType.BENEFICIARY,
      foundation: {
        name: 'Comedor Comunitario Manta',
        mainStreet: 'Av. Malecón',
        secondaryStreet: 'Calle 15',
        reference: 'Frente al parque central',
        cityCode: 'MEC'
      }
    }
  ]
});
