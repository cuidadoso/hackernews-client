import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';

const LINK_SEARCH_QUERY = gql`
  query links($filter: [Filter]!) {
    links(filter: $filter) {
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
    }
  }
`;

class Search extends Component {
  state = {
    links: [],
    filter: ''
  };

  render() {
    return (
      <div>
        <div>
          Search
          <input
            type="text"
            onChange={(e) => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        {this.state.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>
    );
  }

  _executeSearch = async () => {
    const { filter } = this.state;
    const result = await this.props.client.query({
      query: LINK_SEARCH_QUERY,
      variables: {
        filter: [
          {
            id: 'url_or_description',
            value: filter
          }
        ]
      }
    });
    const links = result.data.links.items;
    this.setState({ links });
  };
}

export default withApollo(Search);
