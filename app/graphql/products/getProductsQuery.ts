export const getProductsQuery = `
  query (
    $first: Int,
    $after: String,
    $last: Int,
    $before: String,
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(
      first: $first,
      after: $after,
      last: $last,
      before: $before
      sortKey: $sortKey
      reverse: $reverse
    ) {
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          media(first: 1) {
            nodes {
              preview {
                image {
                  id
                  altText
                  url
                }
              }
            }
          }
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
  }
`;
