import React, { Component } from 'react';
import { Query } from 'react-apollo';

import { DEFAULT_ORDER_BY, DEFAULT_PAGE_SIZE } from '../constants';
import Table from './table/Table';
import { LINK_QUERY } from '../quaries';

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
    page: 0,
    size: DEFAULT_PAGE_SIZE,
    orderBy: DEFAULT_ORDER_BY,
    filter: []
  };

  getData = (filter, page, size, orderBy) => {
    this.setState({
      // filter,
      page,
      size,
      orderBy
    });
  };

  render() {
    const { page, size, orderBy, filter } = this.state;
    return (
      <Query query={LINK_QUERY} variables={{ filter, page, size, orderBy }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>;
          if (error) return <div>Error</div>;

          const linksToRender = data.links.items.map((link) => {
            return { ...link, postedBy: link.postedBy.name };
          });
          const { totalPages } = data.links.pageInfo;
          return (
            <Table
              columns={columns}
              data={linksToRender}
              getData={this.getData}
              pages={totalPages}
            />
          );
        }}
      </Query>
    );
  }
}

export default LinkTable;
