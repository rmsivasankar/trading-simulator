const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.trade.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  await prisma.user.create({
    data: {
      id: 'single-user',
      walletBalance: 5000.00
    }
  });

  // Create companies
  const companies = [
    { name: 'Apple', symbol: 'AAPL', currentPrice: 189.37, priceHistory: [180, 185, 189.37] },
    { name: 'Microsoft', symbol: 'MSFT', currentPrice: 420.72, priceHistory: [415, 418, 420.72] }
  ];

  for (const company of companies) {
    await prisma.company.create({ data: company });
  }

  console.log('Seed completed!');
}

main()
  .catch(e => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });