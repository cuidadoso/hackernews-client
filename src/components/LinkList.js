import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Link from './Link';
import { LINKS_PER_PAGE } from '../constants';

export const FEED_QUERY = gql`
  query links($page: Int, $size: Int, $orderBy: String) {
    links(page: $page, size: $size, orderBy: $orderBy) {
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
      }
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription newLink {
    newLink {
      node {
        id
        url
        description
        createdAt
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

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription newVote {
    newVote {
      node {
        id
        link {
          id
          url
          description
          createdAt
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
        user {
          id
        }
      }
    }
  }
`;

class LinkList extends Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    if (createVote) {
      const isNewPage = this.props.location.pathname.includes('new');
      const page = parseInt(this.props.match.params.page, 10) - 1;

      const orderBy = isNewPage ? 'createdAt_DESC' : null;
      const data = store.readQuery({
        query: FEED_QUERY,
        variables: { page, size: LINKS_PER_PAGE, orderBy }
      });

      const votedLink = data.links.items.find((link) => link.id === linkId);
      votedLink.votes = createVote.link.votes;

      store.writeQuery({ query: FEED_QUERY, data });
    }
  };

  _subscribeToNewLinks = (subscribeToMore) => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newLink = subscriptionData.data.newLink.node;

        return Object.assign({}, prev, {
          links: [newLink, ...prev.links],
          count: prev.links.length + 1,
          __typename: prev.__typename
        });
      }
    });
  };

  _subscribeToNewVotes = (subscribeToMore) => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    });
  };

  _getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new');
    const page = isNewPage ? parseInt(this.props.match.params.page, 10) - 1 : 0;
    const size = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;
    return { page, size, orderBy };
  };

  _getLinksToRender = (data) => {
    const isNewPage = this.props.location.pathname.includes('new');
    if (isNewPage) {
      return data.links.items;
    }
    const rankedLinks = data.links.items.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return rankedLinks;
  };

  _nextPage = () => {
    const nextPage = parseInt(this.props.match.params.page, 10) + 1;
    this.props.history.push(`/new/${nextPage}`);
  };

  _previousPage = () => {
    const previousPage = parseInt(this.props.match.params.page, 10) - 1;
    this.props.history.push(`/new/${previousPage}`);
  };

  render() {
    return (
      <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <div>Fetching</div>;
          if (error) return <div>Error</div>;

          this._subscribeToNewLinks(subscribeToMore);
          this._subscribeToNewVotes(subscribeToMore);
          const linksToRender = this._getLinksToRender(data);
          const isNewPage = this.props.location.pathname.includes('new');

          return (
            <Fragment>
              {linksToRender.map((link, index) => (
                <Link
                  key={link.id}
                  link={link}
                  index={index}
                  updateStoreAfterVote={this._updateCacheAfterVote}
                />
              ))}
              {isNewPage && (
                <div className="flex ml4 mv3 gray">
                  {data.links.pageInfo.hasPreviousPage && (
                    <div className="pointer mr2" onClick={this._previousPage}>
                      Previous
                    </div>
                  )}
                  {data.links.pageInfo.hasNextPage && (
                    <div
                      className="pointer"
                      onClick={() => this._nextPage(data)}
                    >
                      Next
                    </div>
                  )}
                </div>
              )}
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default LinkList;
