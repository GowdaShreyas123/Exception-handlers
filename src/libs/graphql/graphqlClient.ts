import { GraphQLClient } from 'graphql-request';
import Cookies from 'js-cookie';


export function createGraphQLClient() {
    // Get the auth token from cookies
    const authToken = Cookies.get('superAuthToken');

    // Remove '/v1' from API_URL if it exists
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/v1$/, '');

    // Create GraphQL client with authorization header
    return new GraphQLClient(`${baseUrl}/graphql`, {
       headers: authToken
            ? {
                  Authorization: `Bearer ${authToken}`
              }
            : {}
    });
}
