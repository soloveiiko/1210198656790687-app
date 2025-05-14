import { BlockStack, Box, Card, Layout, Page, Text } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import type { ProductEdge } from "../types/shopify";
import { getProductsQuery } from "../graphql/products/getProductsQuery";

export async function loader({ request }: { request: Request }) {
  try {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(getProductsQuery);

    const json = await response.json();
    const products = json?.data?.products;

    return products?.edges ?? [];
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

export default function Index() {
  const products = useLoaderData<ProductEdge[]>();

  const hasProducts = Array.isArray(products) && products.length > 0;

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              {hasProducts ? (
                products.map((product) => {
                  const variant = product.node.variants.edges[0]?.node;
                  return (
                    <Box
                      key={product.node.id}
                      padding="400"
                      background="bg-surface"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                    >
                      <Text variant="headingSm" as="h3">
                        {product.node.title}
                      </Text>
                      {product.node.description && (
                        <Text variant="bodyMd">{product.node.description}</Text>
                      )}
                      {variant && (
                        <>
                          <Text variant="bodyMd">Price: ${variant.price}</Text>
                          <Text variant="bodyMd">SKU: {variant.sku}</Text>
                          <Text variant="bodyMd">
                            Net Quantity: {variant.inventoryQuantity}
                          </Text>
                          {/* Для Net Sales потрібно або інше поле, або окремий запит */}
                          {/* Приклад для Net Sales (якщо це можна отримати): */}
                          {/* <Text variant="bodyMd">Net Sales: {variant.netSales}</Text> */}
                        </>
                      )}
                    </Box>
                  );
                })
              ) : (
                <Text>No products found.</Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// import {
//   BlockStack,
//   Box,
//   Button,
//   Card,
//   Layout,
//   Page,
//   Text,
// } from "@shopify/polaris";
// import { useLoaderData, useSearchParams } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
//
// import { json } from "@remix-run/node";
//
// interface ProductNode {
//   id: string;
//   title: string;
//   description: string;
// }
//
// interface ProductEdge {
//   node: ProductNode;
//   cursor: string;
// }
//
// interface LoaderData {
//   products: ProductEdge[];
//   pageInfo: {
//     hasNextPage: boolean;
//     endCursor: string | null;
//   };
// }

// export async function loader({ request }: { request: Request }) {
//   try {
//     const { admin } = await authenticate.admin(request);
//
//     const url = new URL(request.url);
//     const cursor = url.searchParams.get("cursor");
//
//     const response = await admin.graphql(
//         `#graphql
//       query GetProducts($first: Int!, $after: String) {
//         products(first: $first, after: $after) {
//           edges {
//             node {
//               id
//               title
//               description
//             }
//             cursor
//           }
//           pageInfo {
//             hasNextPage
//             endCursor
//           }
//         }
//       }`,
//       {
//         variables: {
//           first: 10,
//           after: cursor,
//         },
//       },
//     );
//
//     const { data } = await response.json();
//
//     if (!data?.products)
//       return json({ products: [], pageInfo: { hasNextPage: false } });
//
//     return json({
//       products: data.products.edges,
//       pageInfo: data.products.pageInfo,
//     });
//   } catch (error) {
//     console.error("Error loading products:", error);
//     return json({ products: [], pageInfo: { hasNextPage: false } });
//   }
// }
//
// export default function Index() {
//   const { products, pageInfo } = useLoaderData<LoaderData>();
//   const [searchParams] = useSearchParams();
//
//   const hasProducts = products.length > 0;
//
//   return (
//     <Page>
//       <Layout>
//         <Layout.Section>
//           <Card>
//             <BlockStack gap="400">
//               {hasProducts ? (
//                 products.map((product) => (
//                   <Box
//                     key={product.node.id}
//                     padding="400"
//                     background="bg-surface"
//                     borderWidth="025"
//                     borderRadius="200"
//                     borderColor="border"
//                   >
//                     <Text variant="headingSm" as="h3">
//                       {product.node.title}
//                     </Text>
//                     {product.node.description && (
//                       <Text variant="bodyMd">{product.node.description}</Text>
//                     )}
//                   </Box>
//                 ))
//               ) : (
//                 <Text>No products found.</Text>
//               )}
//
//               {pageInfo.hasNextPage && pageInfo.endCursor && (
//                 <Button
//                   url={`?cursor=${encodeURIComponent(pageInfo.endCursor)}`}
//                   fullWidth
//                 >
//                   Load more
//                 </Button>
//               )}
//             </BlockStack>
//           </Card>
//         </Layout.Section>
//       </Layout>
//     </Page>
//   );
// }
