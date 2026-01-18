export const getNotificationsData = (
  donorUserIds: string[],
  beneficiaryUserIds: string[],
  donationIds: string[]
) => [
    {
      message: 'Nueva donación disponible: Pan integral',
      type: 'DONATION_CREATED',
      userId: beneficiaryUserIds[0],
      donationId: donationIds[0]
    },
    {
      message: 'Nueva donación disponible: Pan integral',
      type: 'DONATION_CREATED',
      userId: beneficiaryUserIds[1],
      donationId: donationIds[0]
    },
    {
      message: 'Tu donación "Arroz con pollo" ha sido reclamada',
      type: 'DONATION_CLAIMED',
      userId: donorUserIds[1],
      donationId: donationIds[1]
    },
    {
      message: 'Donación "Frutas variadas" entregada exitosamente',
      type: 'DONATION_DELIVERED',
      userId: donorUserIds[1],
      donationId: donationIds[3]
    },
    {
      message: 'Donación "Frutas variadas" entregada exitosamente',
      type: 'DONATION_DELIVERED',
      userId: beneficiaryUserIds[1],
      donationId: donationIds[3]
    },
    {
      message: 'Nueva donación disponible: Leche y derivados',
      type: 'DONATION_CREATED',
      userId: beneficiaryUserIds[0],
      donationId: donationIds[4]
    },
    {
      message: 'Nueva donación disponible: Leche y derivados',
      type: 'DONATION_CREATED',
      userId: beneficiaryUserIds[2],
      donationId: donationIds[4]
    },
    {
      message: 'Tu donación "Carne de res" ha sido reclamada',
      type: 'DONATION_CLAIMED',
      userId: donorUserIds[2],
      donationId: donationIds[5]
    },
    {
      message: 'Nueva donación disponible: Pasteles variados',
      type: 'DONATION_CREATED',
      userId: beneficiaryUserIds[3],
      donationId: donationIds[6]
    },
    {
      message: 'Donación "Sándwiches" entregada exitosamente',
      type: 'DONATION_DELIVERED',
      userId: donorUserIds[3],
      donationId: donationIds[7]
    },
    {
      message: 'Donación "Sándwiches" entregada exitosamente',
      type: 'DONATION_DELIVERED',
      userId: beneficiaryUserIds[3],
      donationId: donationIds[7]
    }
  ];
