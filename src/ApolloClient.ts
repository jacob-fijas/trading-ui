import { ApolloClient, DefaultOptions } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'

const typenameMiddleware = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = JSON.parse(JSON.stringify(operation.variables), (key, value) => key === '__typename' ? undefined : value)
  }
  return forward(operation)
})

const link = ApolloLink.from([typenameMiddleware, new HttpLink({
  uri: 'http://localhost:4000/'
})])


export default new ApolloClient({
  link,
  cache: new InMemoryCache()
})