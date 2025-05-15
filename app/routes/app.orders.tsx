import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { createRandomOrder } from "../services/orders.server";
import { useFetcher } from "@remix-run/react";

export const action: ActionFunction = async () => {
  await createRandomOrder();
  return redirect("/app/orders");
};

export const loader: LoaderFunction = async () => {
  return {};
};

export default function OrdersPage() {
  const fetcher = useFetcher();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Orders</h1>
      <fetcher.Form method="post">
        <button type="submit">Створити випадкове замовлення</button>
      </fetcher.Form>
    </div>
  );
}
