
import {Tesseract} from "tesseract.ts";
import { TextractClient, AnalyzeDocumentCommand,TextractClientConfig } from "@aws-sdk/client-textract";
import { Buffer } from 'buffer';
// var textract = require('textract');

const FileParser = async(path: any) => {
  console.log('Path',path)
  // var partsOfStr = (''+path).split(',');
  // if(partsOfStr.length > 0){
  //   var type = partsOfStr[0]
  //   console.log('Type', type)
  //   if (type.includes('png')){
  //     console.log('Data type is png')
  //   }else if(type.includes('jpg')){
  //     console.log('Data type is jpg')
  //   }else if(type.includes('pdf')){
  //     console.log('Data type is pdf')
  //   }
  // }

  const configuration: TextractClientConfig = {
     region: 'ap-northeast-2',
     credentials:{
      accessKeyId:'ASIAXBDE6P26C34DHVEQ',
      secretAccessKey:'aMrKAYXb8ZMNpmvoXHXCHBtMkpaJUuDh0OpPTu5h',
      sessionToken: 'IQoJb3JpZ2luX2VjEHkaDmFwLW5vcnRoZWFzdC0yIkgwRgIhAJVCuBIgoVrabLVcQZXwNh9o69AP6l9juVAn3NSGxQnFAiEAm2WlVtCAK+qgyuP1OkWe4y/uCOw3+88Ah7/iwCt5dzIq/gIIkv//////////ARAAGgw0ODMzOTU1MzQ1MjQiDLkfxyIWF9H1iw74+SrSAmvZBzuIHPPREf/+WYo5UHfMsUEcE/Pn/u1+xrSGH+2n4FQJYoAUeCsNwI+WHv9/g5Go8uACKWD2ESkZaZgVHyWje6Nor6SFIxsmwaib8/WhSuWmyyv51lHA3aqFiO9CcIjhDDSBZBRMfsAg1q1Q97XnwJcxpJsl3qiKqKEIPrB6aj2sRZDyN8B5zRZWP+Kx6cQ/6XyO09eR0jHU4suefgyFENC3NwETwSr499jeaS2GAuB4dAUSGFsC5091y9/pV/MtxXdi26DlO3/rBvCPSbFgbKjHmG5GJlQH1zqBygv0oq1Gjr99rOldnqoS+SmWh3kt/u+LjUzsK+7BEpByowFKXZltAs8IMJgyyJfy8wkp1JhWA/GtNsy/aSUQtuLfEF6TJ3eswvNYqjtf6QgNuQnCJheXgBSCjDjAiM84Lozdg5ZjgxYIFxS53zYLaRDQjJqLMJuY76IGOqYBv+zx1AoZO91nNAhjoCwU9+/25poUasdP0spZyQ+c+ZsIuyH2lZahWYWuRpZQlNLiSkYejiWqwQw/6Z2ycQ1A9nr3pVK48h9SkYCjr8HKnVZehmqCqM2PU0wNlohp9gBIaJgkydcxTi2rwdByVBS40DoiNuncXt0jmNbaUPlEJekdjFcqsQvqXLaRIGjT1B8zxNufZBkGJhBVOnnusVnN7YK4TTTXTw=='
     }
    
  }
  
  const client = new TextractClient(configuration)
  // const fs = require('fs')
  // var data = fs.readFileSync(path)
  
  const input = { // AnalyzeDocumentRequest
    Document: { // Document
      Bytes: path,
    },
    FeatureTypes: [ // FeatureTypes // required
      "TABLES" || "FORMS" || "QUERIES" || "SIGNATURES",
    ]
  };

  const command = new AnalyzeDocumentCommand(input);

  const response =  await client.send(command).then(
    (data) => {
      // process data.
      console.log('Data', data)
    },
    (error) => {
      // error handling.
      console.log('Error', error)
    }
  );;
  console.log('Response', response);
  return response
}


export default FileParser

