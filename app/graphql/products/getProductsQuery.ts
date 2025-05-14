export const getProductsQuery = `
  query {
    products(first: 250) {
      edges {
        node {
          id
          title
          description
          variants(first: 1) {
            edges {
              node {
                id
                price
                sku
                inventoryQuantity
              }
            }
          }
        }
      }
    }
  }
`;
