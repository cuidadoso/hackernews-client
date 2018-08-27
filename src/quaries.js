import gql from 'graphql-tag';

export const LINK_QUERY = gql`
  query links($filter: [Filter], $page: Int, $size: Int, $orderBy: [OrderBy]) {
    links(filter: $filter, page: $page, size: $size, orderBy: $orderBy) {
      items {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        total
        totalPages
        pageNumber
      }
    }
  }
`;

export const LINK_QUERY_TABLE = gql`
  query links($filter: [Filter], $page: Int, $size: Int, $orderBy: [OrderBy]) {
    links(filter: $filter, page: $page, size: $size, orderBy: $orderBy) {
      items {
        id
        createdAt
        url
        description
        postedBy {
          name
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        total
        totalPages
        pageNumber
      }
    }
  }
`;
