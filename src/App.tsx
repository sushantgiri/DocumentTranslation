import React , {useState, useCallback,CSSProperties} from 'react';
import './App.css';
import {Tesseract} from "tesseract.ts";
import Dropzone from 'react-dropzone'
import closeIcon from './close.svg';
import closeCircleIcon from './circle_close.svg'
import ClipLoader from "react-spinners/ClipLoader";
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import FileParser from './FileParser';

function App() {

  const [image, setImage] = useState("");
  const [filename, setFilename] = useState("");
  const [onProgress, setOnProgress] = useState(false);
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<Tesseract.Page>();
  const [color, setColor] = useState("#ffffff");
  const [fileLabel, setFileLabel] = useState('');
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    alignSelf:'center'
  };
  
  const resetChanges = () => {
    setImage("")
  }

  const handleClick = () => {
    if (image != ""){

          console.log('Recognizing....')
          setOnProgress(true)
          Tesseract.recognize(
            image,
          )
          .catch (err => {
            console.error('Error is ' + err);
            setOnProgress(false)
            console.log('Error....',err)

          })
          .then(result => {
            console.log('Result....',result)
            setOnProgress(false)
            setResult(result)
      })
    }
    
  }

  return (
    <div className="App">
      {!result && !onProgress && <header className="App-header">
        <p className="header">Scan Contents of Estimate/Quote</p>
        <p className="sub-header">Upload file or Youtube link for translation Estimate</p>
        <div className='tab-container'>
          <p className='tab-selected'>Files</p>
          <p className='tab-unselected'>Links</p>
        </div>
        <p className='ternary-header'>Account photo</p>
        <p className='ternary-sub-header'>Only .jpg and.png files. 500kb max file size.</p>

    

        <Dropzone 
          onDrop={acceptedFiles => {
          acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            setFile(file)
            reader.onload = () => {
                const binaryStr = reader.result
                var partsOfStr = (''+binaryStr).split(',');
                if(partsOfStr.length > 0){
                  const fileParser = FileParser(file.arrayBuffer)
                  console.log('Split', partsOfStr[1])
                  setImage(""+reader.result)
                  setFileLabel(file.name)
                  
                }
                // console.log('Split', partsOfStr)

                
                // console.log('Image Properties', reader.result)

                
              }
            reader.readAsDataURL(file);
            return file;
          });
        }}>
              {({getRootProps, getInputProps}) => (
                <section style={{ borderStyle: 'dotted',
                borderWidth: 1,
                borderRadius: 12,
                marginBottom:12}}>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className='upload-color'>Drag and drop files here or upload</p>
                  </div>
                </section>
              )}
          </Dropzone>

          {image != ""  && 
          <div className='image-container'>
          
            <p className='image-label'>{fileLabel}</p>
            <img src={closeIcon} className='close-icon' alt="React Logo"
            onClick={resetChanges} />

          </div>
        }

     
       
         
        <button onClick={handleClick} className="scan-button">Start Scan</button>

      </header>}

      <ClipLoader
              color={color}
              loading={onProgress}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />

      {result && 
      <header className="App-header">
        <div style={{alignSelf:'center', justifyContent:'center'}}>
            <p className="header">Result of Scanning</p>
            <p className="sub-header">This is the result of document analysis for estimation</p>
        </div>
        
        <div className="result-container">
          <div>
        
        <img src={closeIcon} className='close-icon' alt="React Logo"
            onClick={resetChanges} style={{width: 150, height: 180}}/>

        </div>

        <div style={{flex:1}}>

          <div style={{alignItems:'start',}}>

        <div>
              <p>Basic Information</p>
              <p>{'file name: '+ file?.name }</p>
              <p>{'file size: ' + file?.size }</p>
              <p>{'Extension: '}</p>
              <p>{'Words: ' }</p>
              <p>{'Characters: ' }</p>
        </div>      
          </div>

        <div>

          <div>
          <p>Contents</p>
          <p>{'Content Type: ' }</p>
          <p>{'Words: ' }</p>
          <p>{'Lines: ' }</p>
          <p>{'Paragraphs: ' }</p>
          <p>{'Slides (Pages): ' }</p>
          <p>{'Memo: ' }</p>
          <p>{'Hidden Count: ' }</p>
          <p>{'Multimedia Clips: ' }</p>
          <p>{'Language: '}</p>

          </div>

          <div>
          <p>Tables and Images</p>
          <p>{'Tables: ' }</p>
          <p>{'Words in Tables: ' }</p>
          <p>{'Chars in Tables: ' }</p>
          <p>{'Images: ' }</p>
          <p>{'Chars. in Images ' }</p>

          </div>

        </div>

        <div>

        {/* <div>
          <p>Contents</p>
          <p>Content Type: </p>
          <p>Words:</p>
          <p>Lines: </p>
          <p>Paragraphs: </p>
          <p>Slides(Pages): </p>
          <p>Memo: </p>
          <p>Hiddent count: </p>
          <p>Multimedia clops:</p>
          <p>Language: </p>
        </div> */}

        <div>

        </div>


        </div>

        </div>
        <div style={{}}>
        <img src={closeCircleIcon} className='close-icon' alt="React Logo"
            onClick={resetChanges} style={{marginTop: 10}}/>
        </div>
        </div>
       
      </header>}
      

      

    
        
      
    </div>
  );
}

export default App;
