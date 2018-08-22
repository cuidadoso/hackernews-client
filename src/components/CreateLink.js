import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { DEFAULT_ORDER_BY, DEFAULT_PAGE_SIZE } from '../constants';
import { LINK_QUERY } from '../quaries';

const POST_MUTATION = gql`
  mutation createLink($description: String!, $url: String!) {
    createLink(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

class CreateLink extends Component {
  state = {
    description: '',
    url: ''
  };

  render() {
    const { description, url } = this.state;
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={(e) => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={(e) => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <Mutation
          mutation={POST_MUTATION}
          variables={{ description, url }}
          onCompleted={() => this.props.history.push('/new/1')}
          update={(store, { data: { createLink } }) => {
            const page = 0;
            const orderBy = DEFAULT_ORDER_BY;
            const data = store.readQuery({
              query: LINK_QUERY,
              variables: { page, size: DEFAULT_PAGE_SIZE, orderBy }
            });
            data.links.items.unshift(createLink);
            store.writeQuery({
              query: LINK_QUERY,
              data,
              variables: { page, size: DEFAULT_PAGE_SIZE, orderBy }
            });
          }}
        >
          {(postMutation) => <button onClick={postMutation}>Submit</button>}
        </Mutation>
      </div>
    );
  }
}

export default CreateLink;
