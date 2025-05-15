import prisma from "../db.server";

export async function createRandomOrder() {
  const randomName = `Product #${Math.floor(Math.random() * 1000)}`;
  const randomAmount = parseFloat((Math.random() * 1000).toFixed(2));
  const statuses = ["pending", "paid", "shipped", "cancelled"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  const order = await prisma.order.create({
    data: {
      name: randomName,
      totalAmount: randomAmount,
      status: randomStatus,
    },
  });

  return order;
}
