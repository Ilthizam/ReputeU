import algoliasearch from "algoliasearch";

const algoliaSearchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);

export default algoliaSearchClient;
