import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { DEFAULT_ORDER_BY, DEFAULT_PAGE_SIZE } from '../../constants';

class Table extends Component {
  static defaultProps = {
    columns: [],
    data: [],
    defaultPageSize: DEFAULT_PAGE_SIZE,
    defaultSorted: DEFAULT_ORDER_BY,
    manual: true,
    filterable: true,
    pages: null
  };

  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    defaultPageSize: PropTypes.number,
    defaultSorted: PropTypes.array,
    manual: PropTypes.bool,
    filterable: PropTypes.bool,
    pages: PropTypes.number,
    getData: PropTypes.func.isRequired
  };

  state = {
    loading: false
  };

  fetchData = (state) => {
    this.setState({ loading: true });
    const { pageSize, page, sorted, filtered } = state;
    const { getData } = this.props;
    getData(filtered, page, pageSize, sorted);
    this.setState({ loading: false });
  };

  render() {
    const {
      columns,
      data,
      defaultPageSize,
      defaultSorted,
      manual,
      filterable,
      pages
    } = this.props;
    const { loading } = this.state;
    return (
      <ReactTable
        data={data}
        columns={columns}
        manual={manual} // Forces table not to paginate or sort automatically, so we can handle it server-side
        pages={pages} // Display the total number of pages
        loading={loading} // Display the loading overlay when we need it
        onFetchData={this.fetchData} // Request new data when things change
        filterable={filterable}
        defaultPageSize={defaultPageSize}
        defaultSorted={defaultSorted}
        className="-striped -highlight"
      />
    );
  }
}

export default Table;
