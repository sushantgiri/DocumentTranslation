
import {Tesseract} from "tesseract.ts";
import { TextractClient, AnalyzeDocumentCommand,TextractClientConfig } from "@aws-sdk/client-textract";
import { Buffer } from 'buffer';
import * as fs from 'fs';
const FileParser = async(path: any) => {
  var partsOfStr = (''+path).split(',');
  if(partsOfStr.length > 0){
    var type = partsOfStr[0]
    console.log('Type', type)
    if (type.includes('png')){
      console.log('Data type is png')
    }else if(type.includes('jpg')){
      console.log('Data type is jpg')
    }else if(type.includes('pdf')){
      console.log('Data type is pdf')
    }
  }

  const configuration: TextractClientConfig = {
    region:'XXXXXX',
    // awsAccesskeyID: "ASIAXBDE6P26LYD3XAUM",
    // awsSecretAccessKey: "GgjRnewJBjQoKmqQ/qBy8JuLQ+hi0x3CX06caP2x",
    // awsRegion: "ap-northeast-2",
    credentials: {
      accessKeyId: "XXXXXXXXXXX",
      secretAccessKey: "XXXXXXX",
      sessionToken: "",
    }
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
  const response =  client.send(command).then(
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

