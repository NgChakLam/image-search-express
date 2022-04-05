# image-search-express

Express Server:
Command: npm start
Will run a server at http://localhost:3000/search/all/keyword ,you can replace keyword for a different result


searh with

http://localhost:3000/search/all/{keyword}

example:
http://localhost:3000/search/all/cat



Graphql Server: 
Command: node graphqlserver.js
Running a GraphQL API server at http://localhost:4000/graphql
query:
{
 image(keyword:"hello"){
            image_ID
            thumbnails
            preview
            title
            source
            tags
          }
}

