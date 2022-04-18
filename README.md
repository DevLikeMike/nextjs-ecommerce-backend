# Strapi Back end for an ecommerce site

#### Strapi 4.0.7

## Content Types

There are 3 content types in this application: Users, Orders, and Products.

### Users

Users Takes advantage of the easy to use Strapi Authentication and all the endpoints associated with it.

####

User endpoints

- http://localhost:1337/api/auth/local/register - allows users to register themselves.
  **PUT Request with JSON BODY** expects three key value pairs: email, username and password.
- http://localhost:1337/api/auth/local
  **PUT Request with JSON BODY** expects two key value pairs: identifier and password.
