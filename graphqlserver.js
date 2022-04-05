var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const imageSearch = require ('./functions.js');
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Image{
    image_ID:String
    thumbnails:String
    preview: String
    title:String
    source:String
    tags:[String]
  }


  type Query {
    image(keyword: String!): [Image]
  }
  
`);
// This class implements the ImageList GraphQL type
class ImageList{
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  } 
}
//[ImageSearch]
//imageSearch.allSEARCH('123');
// The root provides a resolver function for each API endpoint

/* async()=>{

}*/
//let test_result= imageSearch.allSEARCH('test'); 
var root = {

  image: async ({keyword})  => {
    let result=[];
    result = await imageSearch.allSEARCH(keyword);
    console.log(keyword,'result', result);
    console.log(' end of result');
    //console.log(keyword,'test_result',await test_result);
    return  result;
    //return [1,2,[3,4,[5,6]]];
  },
  searchImage:(keyword) => {
    return new ImageList(keyword);
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');