var express = require('express');
var router = express.Router();
const axios = require('axios').default;
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Full Stack Test' });
});

/* GET search page. */
router.get('/search/:key', function(req, res, next) {
  res.send(req.params.key)
});

//call unsplash search photos api and return the data
async function unsplashSEARCH(keyword) {
  console.log('run unsplashSEARCH','keyword',keyword);
  let unsplash_api_url="https://api.unsplash.com/search/photos";
  let unsplash_asscess_key=process.env.UNSPLASH_ASSCESS_KEY;
  let unsplash_search_url=unsplash_api_url+"/?query="+keyword+"&client_id="+unsplash_asscess_key;
  console.log('unsplash_search_url',unsplash_search_url);
  try {
    let response = await axios.get(unsplash_api_url,{
      params:{
        query:keyword,
        client_id:unsplash_asscess_key,
      }
    });
    console.log('respone_data',response.data);
    let result=response.data.results;
    console.log('result',result)

    //map the result into the needed format
    let image_array=result.map((obj)=>{
      return {
        image_ID: obj.id, //String, the ID of the image
        thumbnails: obj.urls.thumb ,//String, thumbnails url of the image
        preview: obj.urls.regular,//String, preview url of the image
        title: obj.description,//String, preview url from the image
        source: 'Unsplash',//String, which image library you get this image from? [Unsplash,Storyblocks, Pixabay]
        tags: obj.tags.map((obj)=>{return obj.title}),//Array the tag/keywords of the images (if any)
      };
    });
    console.log('image_array',image_array);
    return image_array;
  } catch (error) {
    console.error(error);
  }
}



/* GET search unsplash page. */
router.get('/search/unsplash/:keyword',async  function(req, res, next) {
  let result= await unsplashSEARCH(req.params.keyword);
  console.log('result',result);
  res.send(result);
});


//call pixabay search photos api and return the data
async function pixabaySEARCH(keyword) {
  console.log('run pixabaySEARCH','keyword',keyword);
  let pixabay_api_url="https://pixabay.com/api";
  let pixabay_asscess_key=process.env.PIXABAY_ASSCESS_KEY;
  let search_url=pixabay_api_url+"/?q="+keyword+"&key="+pixabay_asscess_key;
  console.log('search_url',search_url);
  try {
    let response = await axios.get(pixabay_api_url,{
      params:{
        q:keyword,
        key:pixabay_asscess_key,
      }
    });
    console.log('respone_data',response.data);
    let result=response.data.hits;
    console.log('result',result)

    //map the result into the needed format
    let image_array=result.map((obj)=>{
      return {
        image_ID: obj.id.toString(), //String, the ID of the image
        thumbnails: obj.previewURL ,//String, thumbnails url of the image
        preview: obj.largeImageURL,//String, preview url of the image
        title: null,//String, preview url from the image
        source: 'Pixabay',//String, which image library you get this image from? [Unsplash,Storyblocks, Pixabay]
        tags: obj.tags.split(",").map((obj)=>{return obj.trim();}),//Array the tag/keywords of the images (if any)
      };
    });
    console.log('image_array',image_array);
    return image_array;
  } catch (error) {
    console.error(error);
  }
}
/* GET search pixabay page. */
  router.get('/search/pixabay/:keyword',async  function(req, res, next) {
    let result= await pixabaySEARCH(req.params.keyword);
    console.log('result',result);
    res.send(result);
  });


//call pixabay search photos api and return the data
async function storybloacksSEARCH(keyword) {
  console.log('run storybloacks','keyword',keyword);
  //let storybloacks_api_url="https://api.graphicstock.com//api/v2/images/search?";
  // Provided by Storyblocks
  const publicKey = process.env.STORYBLOCKS_PUBLIC_KEY;
  const privateKey = process.env.STORYBLOCKS_PRIVATE_KEY;
  // url info
  const baseUrl = 'https://api.graphicstock.com';
  const resource = '/api/v2/images/search';
  const urlWithoutQueryParams = baseUrl + resource;
  const user_id="admin";
  const project_id="PatheonFullstackTest";
  const keywords=keyword;
  // HMAC generation
  const expires = Math.floor(Date.now() / 1000) + 100; //(Required) An expiration time in seconds since the Unix epoch (January 1,1970). till 2022-April-2-7:25:44GMT
  const { createHmac } = await import('crypto');
  const hmac= createHmac('sha256', privateKey+expires).update(resource).digest('hex');//(Required) Your authentication code generated using the SHA-256 hmac algorithm with your private key and expires timestamp as the key and the requested resource as the data. HMAC should be provided in hexadecimal.
  //call the api
  try {
    let response = await axios.get(urlWithoutQueryParams,{
      params:{
        APIKEY: publicKey,
        EXPIRES: expires,
        HMAC:hmac,
        user_id:user_id,
        project_id:project_id,
        keywords:keywords,
        extended:'keywords',
      }
    });
    console.log('respone_data',response.data);
    let result = response.data.results;
    //map the result into the needed format
    let image_array=result.map((obj)=>{
      return {
        image_ID: obj.id.toString(), //String, the ID of the image
        thumbnails: obj.thumbnail_url ,//String, thumbnails url of the image
        preview: obj.preview_url,//String, preview url of the image
        title: obj.title,//String, preview url from the image
        source: 'Storyblocks',//String, which image library you get this image from? [Unsplash,Storyblocks, Pixabay]
        tags: obj.keywords,//Array the tag/keywords of the images (if any)
      };
    });
    console.log('image_array',image_array);
    return image_array;
  } catch (error) {
    console.error(error);
  }
}

/* GET search storybloacks page. */
router.get('/search/storybloacks/:keyword',async function(req, res, next) {
  console.log('search storybloacks')
  let result= await storybloacksSEARCH(req.params.keyword);
  console.log('result',result);
  res.send(result);
});



/* GET search all 3rd parties' api page. */
router.get('/search/all/:keyword',async function(req, res, next) {
  console.log('search all ')
  let result=[];
/*   result= result.concat(
    await unsplashSEARCH(req.params.keyword),
    await pixabaySEARCH(req.params.keyword),
    await storybloacksSEARCH(req.params.keyword),
  ); */
  
  result= await Promise.all([unsplashSEARCH(req.params.keyword), pixabaySEARCH(req.params.keyword), storybloacksSEARCH(req.params.keyword)])
  .then(value => {
    result=value.flat();
    //console.log('new value',result);
    return result;
  })
  .catch(err => {
    console.log(err.message);
  })
  console.log('result array',result);
  res.send(result);
});

module.exports = router;
