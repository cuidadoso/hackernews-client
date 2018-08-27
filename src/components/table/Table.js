import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import {
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE
} from '../../constants';

class Table extends Component {
  static defaultProps = {
    columns: [],
    data: [],
    defaultPageSize: DEFAULT_PAGE_SIZE,
    defaultSorted: DEFAULT_ORDER_BY,
    manual: true,
    filterable: true,
    loading: false,
    pages: null,
    pageNumber: DEFAULT_PAGE_NUMBER
  };

  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    defaultPageSize: PropTypes.number,
    defaultSorted: PropTypes.array,
    manual: PropTypes.bool,
    filterable: PropTypes.bool,
    loading: PropTypes.bool,
    pages: PropTypes.number,
    pageNumber: PropTypes.number,
    getData: PropTypes.func.isRequired
  };

  fetchData = (state) => {
    console.log('--- fetchData', state);
    const { pageSize, page, sorted, filtered } = state;
    this.props.getData(filtered, page, pageSize, sorted);
  };

  render() {
    const {
      columns,
      data,
      defaultPageSize,
      defaultSorted,
      manual,
      filterable,
      pages,
      loading,
      pageNumber
    } = this.props;

    return (
      <ReactTable
        data={data}
        columns={columns}
        manual={manual} // Forces table not to paginate or sort automatically, so we can handle it server-side
        pages={pages} // Display the total number of pages
        loading={loading} // Display the loading overlay when we need it
        onFetchData={this.fetchData} // Request new data when things change
        // page={pageNumber}
        //onPageChange={???}
        filterable={filterable}
        defaultPageSize={defaultPageSize}
        defaultSorted={defaultSorted}
        className="-striped -highlight"
      />
    );
  }
}

export default Table;
