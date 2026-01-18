import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { citiesData } from './data/cities.data.js';
import { getUsersData } from './data/users.data.js';
import { getPeakHoursData } from './data/peakHours.data.js';
import { getDonationsData } from './data/donations.data.js';
import { getNotificationsData } from './data/notifications.data.js';

async function main() {
  const seedPassword = process.env.SEED_PASSWORD;

  if (!seedPassword) {
    throw new Error('SEED_PASSWORD environment variable is not set');
  }

  console.log('🌱 Starting seed...\n');

  // 1. Clean database
  console.log('🗑️  Cleaning database...');
  await prisma.notification.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.peakHour.deleteMany();
  await prisma.beneficiary.deleteMany();
  await prisma.location.deleteMany();
  await prisma.donor.deleteMany();
  await prisma.foundation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.city.deleteMany();
  console.log('✅ Database cleaned\n');

  // 2. Create cities
  console.log('🏙️  Creating Ecuador cities...');
  for (const city of citiesData) {
    await prisma.city.upsert({
      where: { code: city.code },
      update: {},
      create: city
    });
  }
  console.log(`✅ ${citiesData.length} cities created\n`);

  // 3. Create users (donors and beneficiaries)
  const hashedPassword = await bcrypt.hash(seedPassword, 10);
  const usersData = getUsersData(hashedPassword);

  console.log('👤 Creating donors...');
  const donors = [];
  const donorUserIds = [];
  const locationIds = [];

  for (const donorData of usersData.donors) {
    const donor = await prisma.user.create({
      data: {
        email: donorData.email,
        password: donorData.password,
        firstName: donorData.firstName,
        lastName: donorData.lastName,
        userType: donorData.userType,
        donor: {
          create: {
            locations: {
              create: {
                name: donorData.location.name,
                mainStreet: donorData.location.mainStreet,
                secondaryStreet: donorData.location.secondaryStreet,
                reference: donorData.location.reference,
                cityCode: donorData.location.cityCode
              }
            }
          }
        }
      },
      include: {
        donor: {
          include: { locations: true }
        }
      }
    });
    donors.push(donor);
    donorUserIds.push(donor.id);
    locationIds.push(donor.donor!.locations[0].id);
  }
  console.log(`✅ ${donors.length} donors created\n`);

  console.log('🏢 Creating beneficiaries...');
  const beneficiaries = [];
  const beneficiaryUserIds = [];

  for (const beneficiaryData of usersData.beneficiaries) {
    const beneficiary = await prisma.user.create({
      data: {
        email: beneficiaryData.email,
        password: beneficiaryData.password,
        firstName: beneficiaryData.firstName,
        lastName: beneficiaryData.lastName,
        userType: beneficiaryData.userType,
        beneficiary: {
          create: {
            foundation: {
              create: {
                name: beneficiaryData.foundation.name,
                mainStreet: beneficiaryData.foundation.mainStreet,
                secondaryStreet: beneficiaryData.foundation.secondaryStreet,
                reference: beneficiaryData.foundation.reference,
                cityCode: beneficiaryData.foundation.cityCode
              }
            }
          }
        }
      }
    });
    beneficiaries.push(beneficiary);
    beneficiaryUserIds.push(beneficiary.id);
  }
  console.log(`✅ ${beneficiaries.length} beneficiaries created\n`);

  // 4. Create peak hours
  console.log('⏰ Creating peak hours...');
  const peakHoursData = getPeakHoursData(locationIds);
  await prisma.peakHour.createMany({
    data: peakHoursData
  });
  console.log('✅ Peak hours created\n');

  // 5. Create donations
  console.log('🎁 Creating donations...');
  const donorIds = donors.map(d => d.donor!.id);
  const donationsData = getDonationsData(donorIds, locationIds, beneficiaryUserIds);

  const createdDonations = [];
  for (const donationData of donationsData) {
    const donation = await prisma.donation.create({
      data: donationData
    });
    createdDonations.push(donation);
  }
  const donationIds = createdDonations.map(d => d.id);
  console.log(`✅ ${createdDonations.length} donations created\n`);

  // 6. Create notifications
  console.log('🔔 Creating notifications...');
  const notificationsData = getNotificationsData(donorUserIds, beneficiaryUserIds, donationIds);
  await prisma.notification.createMany({
    data: notificationsData
  });
  console.log('✅ Notifications created\n');

  // Summary
  console.log('========================================');
  console.log('🎉 Seed completed successfully!');
  console.log('========================================');
  console.log('\n📊 Summary:');
  console.log(`   • ${citiesData.length} cities with 3-letter codes`);
  console.log(`   • ${donors.length} donors (Quito, Guayaquil, Cuenca, Manta)`);
  console.log(`   • ${beneficiaries.length} beneficiaries (Quito, Guayaquil, Cuenca, Manta)`);
  console.log(`   • ${peakHoursData.length} peak hour configurations`);
  console.log(`   • ${createdDonations.length} donations (various statuses)`);
  console.log(`   • ${notificationsData.length} notifications`);
  console.log(`\n🔑 Test credentials (all use password: ${seedPassword}):`);
  console.log('   Donors:');
  console.log('     • donor1@example.com (Quito - UIO)');
  console.log('     • donor2@example.com (Guayaquil - GYE)');
  console.log('     • donor3@example.com (Cuenca - CUE)');
  console.log('     • donor4@example.com (Manta - MEC)');
  console.log('   Beneficiaries:');
  console.log('     • beneficiary1@example.com (Quito - UIO)');
  console.log('     • beneficiary2@example.com (Guayaquil - GYE)');
  console.log('     • beneficiary3@example.com (Cuenca - CUE)');
  console.log('     • beneficiary4@example.com (Manta - MEC)');
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
