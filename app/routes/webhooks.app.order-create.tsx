import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import type { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { payload } = await authenticate.webhook(request);
    console.log("Received webhook payload:", payload);

    const { name, created_at, total_price, financial_status } = payload;

    const totalPrice = total_price ? parseFloat(total_price) : 0;

    await prisma.order.create({
      data: {
        name,
        createdAt: new Date(created_at),
        totalPrice: totalPrice,
        status: financial_status,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return new Response("Webhook processing error", { status: 500 });
  }
};
