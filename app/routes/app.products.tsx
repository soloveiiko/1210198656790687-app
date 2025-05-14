import {
  DataTable,
  LegacyCard,
  Page,
  type TableData,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageIcon } from "@shopify/polaris-icons";
import { authenticate } from "~/shopify.server";
import { getProductsQuery } from "~/graphql/products/getProductsQuery";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const searchParam = url.searchParams;

  const rel = searchParam.get("rel");
  const cursor = searchParam.get("cursor");
  const sortKey = searchParam.get("sortKey") || "TITLE";
  const reverse = searchParam.get("reverse") === "true";

  const variables: any = {
    sortKey,
    reverse,
  };

  if (cursor && rel === "next") {
    variables.first = 2;
    variables.after = cursor;
  } else if (cursor && rel === "previous") {
    variables.last = 2;
    variables.before = cursor;
  } else {
    variables.first = 2;
  }
  try {
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(getProductsQuery, {
      variables,
    });
    const parsedResponse = await response.json();

    const products = parsedResponse.data.products.edges;
    const pageInfo = parsedResponse.data.products.pageInfo;
    console.log("pageInfoo", pageInfo);

    const mappedProducts = products.map(({ node }: any) => {
      const variant = node.variants?.nodes[0] ?? {};
      const image = node.media?.nodes?.[0]?.preview.image ?? {};

      return {
        id: node.id,
        title: node.title,
        price: parseFloat(variant.price ?? "0"),
        quantity: variant.inventoryQuantity ?? 0,
        imageSrc: image.url ?? null,
        imageAlt: image.altText ?? node.title,
      };
    });

    return {
      products: mappedProducts,
      hasPreviousPage: pageInfo?.hasPreviousPage ?? false,
      hasNextPage: pageInfo?.hasNextPage ?? false,
      startCursor: products[0]?.cursor ?? null,
      endCursor: products.at(-1)?.cursor ?? null,
      pageInfo,
      sortKey,
      reverse,
    };
  } catch (error) {
    console.error("Error loading products:", error);
    return { products: [], endCursor: null, hasNextPage: false };
  }
}

export default function Products() {
  const {
    products,
    hasNextPage,
    hasPreviousPage,
    startCursor,
    endCursor,
    sortKey,
    reverse,
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [sortedRows, setSortedRows] = useState<TableData[][] | null>(null);

  useEffect(() => {
    setSortedRows(null);
  }, [products]);

  const buildPaginationLink = (rel: string, cursor: string) => {
    const params = new URLSearchParams({
      rel,
      cursor,
      sortKey,
      reverse: reverse.toString(),
    });
    return `/app/products/?${params.toString()}`;
  };

  const hasProducts = Array.isArray(products) && products.length > 0;

  const productRows: TableData[][] = products.map((product: any) => {
    const productImage = (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Thumbnail
          source={product.imageSrc ? product.imageSrc : ImageIcon}
          alt={product.imageAlt ? product.imageAlt : "default"}
          size="small"
        />
      </div>
    );

    return [
      productImage,
      product.title,
      `$${product.price.toFixed(2)}`,
      product.quantity,
    ];
  });
  const pagination = useMemo(() => {
    return {
      previous: {
        disabled: !hasPreviousPage || !startCursor,
        link: buildPaginationLink("previous", startCursor),
      },
      next: {
        disabled: !hasNextPage || !endCursor,
        link: buildPaginationLink("next", endCursor),
      },
    };
  }, [hasNextPage, hasPreviousPage, startCursor, endCursor, sortKey, reverse]);

  const rows = sortedRows ?? productRows;

  function sortCurrency(
    rows: TableData[][],
    index: number,
    direction: "ascending" | "descending",
  ): TableData[][] {
    return [...rows].sort((rowA, rowB) => {
      const amountA = parseFloat((rowA[index] || 0).toString().substring(1));
      const amountB = parseFloat((rowB[index] || 0).toString().substring(1));

      return direction === "descending" ? amountB - amountA : amountA - amountB;
    });
  }

  const handleSort = useCallback(
    (index: number, direction: "ascending" | "descending") =>
      setSortedRows(sortCurrency(rows, index, direction)),
    [rows],
  );
  return (
    <Page title="Products">
      <LegacyCard>
        {hasProducts ? (
          <DataTable
            columnContentTypes={["text", "text", "numeric", "numeric"]}
            headings={["", "Product", "Price", "Quantity"]}
            rows={rows}
            sortable={[false, false, true, false]}
            initialSortColumnIndex={2}
            onSort={handleSort}
            pagination={{
              hasPrevious: !pagination.previous.disabled,
              onPrevious: () => navigate(pagination.previous.link),
              hasNext: !pagination.next.disabled,
              onNext: () => navigate(pagination.next.link),
            }}
          />
        ) : (
          <Text as="span">No products found.</Text>
        )}
      </LegacyCard>
    </Page>
  );
}
