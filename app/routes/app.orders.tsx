import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { createRandomOrder } from "../services/orders.server";
import { useFetcher } from "@remix-run/react";
import { Button, Card, Layout, Page } from "@shopify/polaris";

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
    <Page title="Orders">
      <Layout>
        <Layout.Section>
          <Card>
            <fetcher.Form method="post">
              <Button submit>Order</Button>
            </fetcher.Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
