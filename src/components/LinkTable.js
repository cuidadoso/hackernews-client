import React, { Component } from 'react';
import { Query } from 'react-apollo';

import {
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_COUNT,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE
} from '../constants';
import Table from './table/Table';
import { LINK_QUERY_TABLE } from '../quaries';

const columns = [
  {
    Header: 'ID',
    accessor: 'id'
  },
  {
    Header: 'Posted By',
    id: 'postedBy',
    accessor: (d) => d.postedBy
  },
  {
    Header: 'URL',
    accessor: 'url'
  },
  {
    Header: 'Description',
    accessor: 'description'
  },
  {
    Header: 'Created at',
    accessor: 'createdAt'
  }
];

class LinkTable extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {
    page: DEFAULT_PAGE_NUMBER,
    size: DEFAULT_PAGE_SIZE,
    orderBy: DEFAULT_ORDER_BY,
    filter: []
  };

  getData = (filter, page, size, orderBy) => {
    this.setState({
      filter,
      page,
      size,
      orderBy
    });
  };

  render() {
    const { page, size, orderBy, filter } = this.state;
    return (
      <Query
        query={LINK_QUERY_TABLE}
        variables={{ filter, page, size, orderBy }}
      >
        {({ loading, error, data }) => {
          if (error) return <div>Error</div>;
          let linksToRender = [];
          let totalPages = DEFAULT_PAGE_COUNT;
          let pageNumber = DEFAULT_PAGE_NUMBER;
          if (!loading) {
            linksToRender = data.links.items.map((link) => {
              return { ...link, postedBy: link.postedBy.name };
            });
            totalPages = data.links.pageInfo.totalPages;
            pageNumber = data.links.pageInfo.pageNumber;
          }
          return (
            <Table
              columns={columns}
              data={linksToRender}
              getData={this.getData}
              loading={loading}
              pages={totalPages}
              pageNumber={pageNumber}
            />
          );
        }}
      </Query>
    );
  }
}

export default LinkTable;
