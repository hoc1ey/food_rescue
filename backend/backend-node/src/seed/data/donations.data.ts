import { DonationStatus } from '../../generated/prisma/index.js';

export const getDonationsData = (
  donorIds: number[],
  locationIds: number[],
  beneficiaryIds: string[]
) => [
    {
      productName: 'Pan integral',
      quantity: 20,
      unit: 'unidades',
      status: DonationStatus.AVAILABLE,
      donorId: donorIds[0],
      locationId: locationIds[0],
      beneficiaryId: null,
      donorConfirmed: false,
      beneficiaryConfirmed: false
    },
    {
      productName: 'Arroz con pollo',
      quantity: 15,
      unit: 'porciones',
      status: DonationStatus.ASSIGNED,
      donorId: donorIds[1],
      locationId: locationIds[1],
      beneficiaryId: beneficiaryIds[0],
      donorConfirmed: true,
      beneficiaryConfirmed: false
    },
    {
      productName: 'Verduras mixtas',
      quantity: 10,
      unit: 'kg',
      status: DonationStatus.AVAILABLE,
      donorId: donorIds[0],
      locationId: locationIds[0],
      beneficiaryId: null,
      donorConfirmed: false,
      beneficiaryConfirmed: false
    },
    {
      productName: 'Frutas variadas',
      quantity: 5,
      unit: 'kg',
      status: DonationStatus.DELIVERED,
      donorId: donorIds[1],
      locationId: locationIds[1],
      beneficiaryId: beneficiaryIds[1],
      donorConfirmed: true,
      beneficiaryConfirmed: true
    },
    {
      productName: 'Leche y derivados',
      quantity: 30,
      unit: 'litros',
      status: DonationStatus.AVAILABLE,
      donorId: donorIds[2],
      locationId: locationIds[2],
      beneficiaryId: null,
      donorConfirmed: false,
      beneficiaryConfirmed: false
    },
    {
      productName: 'Carne de res',
      quantity: 8,
      unit: 'kg',
      status: DonationStatus.ASSIGNED,
      donorId: donorIds[2],
      locationId: locationIds[2],
      beneficiaryId: beneficiaryIds[2],
      donorConfirmed: false,
      beneficiaryConfirmed: true
    },
    {
      productName: 'Pasteles variados',
      quantity: 25,
      unit: 'unidades',
      status: DonationStatus.AVAILABLE,
      donorId: donorIds[3],
      locationId: locationIds[3],
      beneficiaryId: null,
      donorConfirmed: false,
      beneficiaryConfirmed: false
    },
    {
      productName: 'Sándwiches',
      quantity: 40,
      unit: 'unidades',
      status: DonationStatus.ASSIGNED,
      donorId: donorIds[3],
      locationId: locationIds[3],
      beneficiaryId: beneficiaryIds[3],
      donorConfirmed: true,
      beneficiaryConfirmed: true
    }
  ];