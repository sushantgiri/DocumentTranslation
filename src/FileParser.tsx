
import {Tesseract} from "tesseract.ts";
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";

const FileParser = () => {
  const configuration = {
    awsAccesskeyID: "ASIAXBDE6P26LYD3XAUM",
    awsSecretAccessKey: "GgjRnewJBjQoKmqQ/qBy8JuLQ+hi0x3CX06caP2x",
    awsRegion: "ap-northeast-2"
  }
  const client = new TextractClient(configuration)

}


export default FileParser

