import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sigeco.com' },
    update: {},
    create: {
      email: 'admin@sigeco.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create sample units
  const units = await Promise.all([
    prisma.unit.upsert({
      where: { number_block: { number: '101', block: 'A' } },
      update: {},
      create: {
        number: '101',
        block: 'A',
        type: '2 Quartos',
        status: 'OCUPADO',
      },
    }),
    prisma.unit.upsert({
      where: { number_block: { number: '102', block: 'A' } },
      update: {},
      create: {
        number: '102',
        block: 'A',
        type: '3 Quartos',
        status: 'OCUPADO',
      },
    }),
    prisma.unit.upsert({
      where: { number_block: { number: '103', block: 'A' } },
      update: {},
      create: {
        number: '103',
        block: 'A',
        type: '2 Quartos',
        status: 'VAGO',
      },
    }),
  ]);

  console.log(`✅ ${units.length} units created`);

  // Create sample residents
  const resident1 = await prisma.resident.upsert({
    where: { email: 'ana.silva@email.com' },
    update: {},
    create: {
      name: 'Ana Silva Costa',
      email: 'ana.silva@email.com',
      phone: '(11) 99999-1234',
      document: '123.456.789-00',
      type: 'PROPRIETARIO',
      status: 'ATIVO',
      unitId: units[0].id,
    },
  });

  const resident2 = await prisma.resident.upsert({
    where: { email: 'joao.santos@email.com' },
    update: {},
    create: {
      name: 'João Santos Lima',
      email: 'joao.santos@email.com',
      phone: '(11) 99999-5678',
      document: '987.654.321-00',
      type: 'LOCATARIO',
      status: 'ATIVO',
      unitId: units[1].id,
    },
  });

  console.log(`✅ Residents created`);

  // Create sample appointments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointment = await prisma.appointment.create({
    data: {
      visitorName: 'Dr. Carlos Mendes',
      visitorDoc: '456.789.123-00',
      visitorPhone: '(11) 99999-9012',
      destination: 'Apto 101',
      reason: 'Consulta médica domiciliar',
      scheduledDate: tomorrow,
      scheduledTime: '14:00',
      status: 'CONFIRMADO',
      observations: 'Médico cardiologista',
      residentId: resident1.id,
      unitId: units[0].id,
    },
  });

  console.log(`✅ Sample appointment created`);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
