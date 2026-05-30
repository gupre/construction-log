import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const workTypes = [
  { name: 'Кладка перегородок', unit: 'м²' },
  { name: 'Монтаж опалубки', unit: 'м²' },
  { name: 'Бетонирование', unit: 'м³' },
  { name: 'Армирование', unit: 'кг' },
  { name: 'Гидроизоляция', unit: 'м²' },
  { name: 'Штукатурные работы', unit: 'м²' },
  { name: 'Монтаж перекрытий', unit: 'м²' },
  { name: 'Земляные работы', unit: 'м³' },
  { name: 'Укладка кровли', unit: 'м²' },
  { name: 'Монтаж окон', unit: 'шт.' },
  { name: 'Монтаж дверей', unit: 'шт.' },
  { name: 'Электромонтажные работы', unit: 'п.м.' },
  { name: 'Сантехнические работы', unit: 'п.м.' },
  { name: 'Монтаж вентиляции', unit: 'п.м.' },
  { name: 'Укладка плитки', unit: 'м²' },
  { name: 'Малярные работы', unit: 'м²' },
  { name: 'Устройство стяжки', unit: 'м²' },
  { name: 'Монтаж лесов', unit: 'м²' },
];

async function main() {
  console.log('Seeding work types...');
  for (const wt of workTypes) {
    await prisma.workType.upsert({
      where: { name: wt.name },
      update: {},
      create: wt,
    });
  }

  const existing = await prisma.workEntry.count();
  if (existing > 0) {
    console.log(`Entries already exist (${existing}), skipping sample data.`);
    return;
  }

  console.log('Seeding sample work entries...');
  const allTypes = await prisma.workType.findMany();
  const getType = (name: string) => allTypes.find(t => t.name === name)!;

  const entries = [
    { date: new Date('2024-05-15'), workTypeId: getType('Кладка перегородок').id, volume: 48, unit: 'м²', executor: 'Петров А.В.', notes: 'Ось Б-В, этаж 3' },
    { date: new Date('2024-05-15'), workTypeId: getType('Бетонирование').id, volume: 24, unit: 'м³', executor: 'Сидоров И.К.', notes: 'Перекрытие 3-го этажа' },
    { date: new Date('2024-05-16'), workTypeId: getType('Армирование').id, volume: 1250, unit: 'кг', executor: 'Иванов С.П.', notes: null },
    { date: new Date('2024-05-17'), workTypeId: getType('Монтаж опалубки').id, volume: 36, unit: 'м²', executor: 'Козлов Р.Н.', notes: null },
    { date: new Date('2024-05-18'), workTypeId: getType('Штукатурные работы').id, volume: 120, unit: 'м²', executor: 'Морозов В.Г.', notes: 'Блок А, этажи 1-2' },
  ];

  for (const entry of entries) {
    await prisma.workEntry.create({ data: entry });
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
