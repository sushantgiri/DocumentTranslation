import { useState, useCallback } from 'react';
import './App.css';
import {Tesseract} from "tesseract.ts";
import Dropzone from 'react-dropzone'
import closeIcon from './close.svg';
import { ImageLike } from 'tesseract.js';

function App() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState("")
  const [data, setData] = useState(null);
  const [onProgress, setOnProgress] = useState(false);
  
  const resetChanges = () => {
    setImage("")
    setText("")
  }

  const handleClick = () => {
    if (image != ""){
          console.log('Recognizing....')
          Tesseract.recognize(
            image,
          )
          .catch (err => {
            console.error('Error is ' + err);
            setOnProgress(false)
            console.log('Error....',err)

          })
          .then(result => {
            console.log('Result....',JSON.stringify(result))
            setOnProgress(false)

            // if(result.data){
            //   setText(result.data.text);
            //   setData(result.data)
              
            //   setOnProgress(false)
              
            // }
      })
    }
    
  }

  return (
    <div className="App">
      <header className="App-header">
        <p className="header">Scan Contents of Estimate/Quote</p>
        <p className="sub-header">Upload file or Youtube link for translation Estimate</p>
        <div className='tab-container'>
          <p className='tab-selected'>Files</p>
          <p className='tab-unselected'>Links</p>
        </div>
        <p className='ternary-header'>Account photo</p>
        <p className='ternary-sub-header'>Only .jpg and.png files. 500kb max file size.</p>

        <Dropzone onDrop={acceptedFiles => {
          acceptedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                const binaryStr = reader.result
                console.log('Image Properties', reader.result?.toString)
                setImage(""+reader.result?.toString)
                setResult(""+reader.result?.toString)        
              }
            reader.readAsDataURL(file);
            return file;
          });
        }}>
              {({getRootProps, getInputProps}) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                </section>
              )}
          </Dropzone>

          {image != ""  && 
        <div className='image-container'>
        
          <p className='image-label'>Document.png</p>
          <img src={closeIcon} className='close-icon' alt="React Logo"
          onClick={resetChanges} />

        </div>
        }
        <div>
          <p style={{color:'#000'}}> {text} </p>
        </div>
         
        <button onClick={handleClick} className="scan-button">Start Scan</button>

      </header>

    
        
      
    </div>
  );
}

export default App;
