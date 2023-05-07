import React , {useState, useCallback,CSSProperties} from 'react';
import './App.css';
import {Tesseract} from "tesseract.ts";
import Dropzone from 'react-dropzone'
import closeIcon from './close.svg';
import closeCircleIcon from './circle_close.svg'
import documentIcon from './file_document.svg'
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
    setImage('')
    setFile(undefined)
    setResult(undefined)
    setFileLabel('')
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const fetchFileExtension = (filename: string) => {
    return filename.split('.').pop();
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
                  console.log('Split', file.arrayBuffer)
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
        
        <img src={documentIcon} className='close-icon' alt="React Logo"
            style={{width: 150, height: 180}}/>

        </div>

        <div style={{flex:1}}>

          <div style={{alignItems:'start',}}>

        <div style={{textAlign:'left'}}>
          <div style={{}}>
                <p style={{fontSize: 18, fontWeight:'bold'}}>Basic Information</p>
                <p style={{fontSize: 14}}>{'file name: '+ file?.name }</p>
                <p style={{fontSize: 14}}>{'file size: '+ formatBytes(file!.size)}</p>
                <p style={{fontSize: 14}}>{'Extension: '+ fetchFileExtension(file!.name)}</p>
                <p style={{fontSize: 14}}>{'Words: '+ result.words.length }</p>
                <p style={{fontSize: 14}}>{'Characters: '+ result.text.length}</p>
          </div>
          <div style={{marginTop: 40,flexDirection:'row', display:'flex'}}>
            <div style={{flex: 1}}>
                <p style={{fontSize: 18, fontWeight:'bold'}}>Contents</p>
                <p style={{fontSize: 14}}>{'Content-Type: '+ file?.type}</p>
                <p style={{fontSize: 14}}>{'Words: '+ result.words.length}</p>
                <p style={{fontSize: 14}}>{'Lines: '+ result.lines.length }</p>
                <p style={{fontSize: 14}}>{'Paragraphs: '+ result.paragraphs.length }</p>
                <p style={{fontSize: 14}}>{'Slides(Pages): N/A'  }</p>
                <p style={{fontSize: 14}}>{'Memo: N/A' }</p>
                <p style={{fontSize: 14}}>{'Hidden Count: N/A'}</p>
                <p style={{fontSize: 14}}>{'Multimedia clips: N/A' }</p>
                <p style={{fontSize: 14}}>{'Language: N/A' }</p>
            </div>

            <div style={{flex: 1}}>
                <p style={{fontSize: 18, fontWeight:'bold'}}>MS Words</p>
                <p style={{fontSize: 14}}>{'Content-Type: '+ 'N/A' }</p>
                <p style={{fontSize: 14}}>{'Words: '+ 'N/A' }</p>
                <p style={{fontSize: 14}}>{'Lines: '+ 'N/A' }</p>
                <p style={{fontSize: 14}}>{'Paragraphs: '+ 'N/A' }</p>
                <p style={{fontSize: 14}}>{'Slides(Pages): '+ 'N/A' }</p>
                <p style={{fontSize: 14}}>{'Memo: '+ 'N/A'}</p>
                <p style={{fontSize: 14}}>{'Hidden Count: '+ 'N/A' }</p>
                <p style={{fontSize: 14}}>{'Multimedia clips: '+ 'N/A' }</p>
                <p style={{fontSize: 14}}>{'Language: '+ 'N/A' }</p>
            </div>
          </div>

          <div style={{marginTop: 40,flexDirection:'row', display:'flex'}}>
            <div style={{flex: 1}}>
                <p style={{fontSize: 18, fontWeight:'bold'}}>Table & Image</p>
                <p style={{fontSize: 14}}>{'Tables: '+ 'N/A'}</p>
                <p style={{fontSize: 14}}>{'Words in Tables: '+ 'N/A'}</p>
                <p style={{fontSize: 14}}>{'Chars in Tables: '+ 'N/A' }</p>
                <p style={{fontSize: 14}}>{'Images: '+ 'N/A'}</p>
                <p style={{fontSize: 14}}>{'Chars. in Images: '+ 'N/A'}</p>
      
            </div>
          </div>

          <div style={{marginTop: 40,flexDirection:'row', display:'flex'}}>
            <div style={{flex: 1}}>
                <p style={{fontSize: 18, fontWeight:'bold'}}>High Frequency Word</p>
              
            </div>
          </div>
        </div>  
        
            
          </div>

        <div>

  

       

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
