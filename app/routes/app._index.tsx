import type { TableData } from "@shopify/polaris";
import { DataTable, LegacyCard, Page } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import type { ProductEdge } from "~/types/shopify";
import { authenticate } from "~/shopify.server";

export async function loader({ request }: { request: Request }) {
  try {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(`
      query {
        products(first: 250) {
          nodes {
            id
            title
            variants(first: 1) {
              nodes {
                id
                price
                inventoryQuantity
              }
            }
          }
        }
      }
    `);

    const json = await response.json();
    const products = json.data.products.nodes;

    return products ?? [];
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

export default function Index() {
  const products = useLoaderData<ProductEdge[]>();

  const hasProducts = Array.isArray(products) && products.length > 0;

  const rows: TableData[][] = products.map((product: any) => {
    const variant = product.variants?.nodes?.[0];
    const price = variant?.price ? Number(variant.price).toFixed(2) : "N/A";
    const quantity = variant?.inventoryQuantity ?? "N/A";

    return [product.title, price, quantity];
  });

  return (
    <Page title={"Home page"}>
      {hasProducts ? (
        <LegacyCard>
          <DataTable
            columnContentTypes={["text", "numeric", "numeric"]}
            headings={["Product", "Price", "SKU Number"]}
            rows={rows}
          />
        </LegacyCard>
      ) : (
        <Text as="span">No products found.</Text>
      )}
    </Page>
  );
}
