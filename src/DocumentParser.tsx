import React, { ChangeEvent, useState } from 'react';
import AWS from 'aws-sdk';

const DocumentParser: React.FC = () => {
    AWS.config.update({
        accessKeyId: 'ASIAXBDE6P26L5I7LZFR',
        secretAccessKey: 'T3jjnNascyHD79hh5hn129OfORLUvGyVCZBFUx5X',
        sessionToken: 'IQoJb3JpZ2luX2VjEPP//////////wEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhAIUwdSknIkY+XeaSRjZF0abqfYHlixFA3eZYZTJYlTa0AiEA9t30yvymbxbn7SAhLacqergtZoM7f5SBVZ+RgBXCJTsq9QIIHBAAGgw0ODMzOTU1MzQ1MjQiDISbuBGkMqFdmZFD4yrSAmpNeLuej9CCSBpB6W14vOogCpXpFnlgECOunVsUEPLjCbiGGCHwlOnzwXPjGEO8w6kyJQbuppTvg9ITl7fodIBYEfzd4NFbpkVT4gid9g3qzudMopaAu2AWmpCktPlc9QU1m1bVS+M9vn+NDve4tsr1Gl3YMiDAK91hNgFl2oAMKZMD7a9IlfUbk8vbwPI+Sqafh0QQHjnCwwVu1M0ZQ/uFXRE7MD45fKDYJGg15q320eWgb6Q6wpO1sVOMqQmv7fmfNVKHwZq/If/Z7/a7PfoZV9hXYXHHWYzoLrUdiJBt1wVrezHBmn0Hp4+EcatqJUu2LwzcaMMuisnMX3RYbMNSh/xluUpag+Q//T+dz+CvbNX91ljP8Hv1Y5dZaXDpsr9gld+KoVVGN16eNvkjL/Jjs1BX0tG+JEH4gwV6JEkUqjaacN7yPz/ViX8GJweazV9VMOf0iaMGOqYBdHgS0W7wm2g7f89nd79eTWr7jFf1e6R+Ku2ZyWhZhglTKgPQa9zv48BtYiV4eyasZ3krvuECVIDBKTVhJGdB0xjWzjXN2Rn0+U1MnwK5cqy5PJGVp+zp2Tt797VUnVM8iELvd5XrOpTaywDuA2qg1P4e+EhLzmGVSJUuIh0YnHA+6nmhR1zT7l4TEHAQmoX8Z4Ccfi0j1VTpE9RqWmkSum+PftMrJQ==',
        region:'ap-northeast-2'
      });
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files && event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const uploadDocumentToS3 = async (documentBytes: Uint8Array, s3ObjectKey: string): Promise<string> => {
    console.log('Uploading...')

    const s3 = new AWS.S3();

    const params: AWS.S3.PutObjectRequest = {
      Bucket: 'gconbucket',
      Key:  s3ObjectKey,
      Body: documentBytes,
    };
    console.log('Params', params)

    const response = await s3.putObject(params).promise();
    console.log('Response', response)
    return response.ETag!;
  };

  const startDocumentTextDetection = async (s3BucketName: string, s3ObjectKey: string): Promise<string> => {
    const textract = new AWS.Textract();

    const params: AWS.Textract.StartDocumentTextDetectionRequest = {
      DocumentLocation: {
        S3Object: {
          Bucket: s3BucketName,
          Name: s3ObjectKey,
        },
      },
    };

    const response = await textract.startDocumentTextDetection(params).promise();
    return response.JobId!;
  };

  const getDocumentTextDetection = async (jobId: string): Promise<AWS.Textract.GetDocumentTextDetectionResponse> => {
    const textract = new AWS.Textract();

    const params: AWS.Textract.GetDocumentTextDetectionRequest = {
      JobId: jobId,
    };

    const response = await textract.getDocumentTextDetection(params).promise();
    return response;
  };

  const parseDocument = async () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const documentBytes = new Uint8Array(fileReader.result as ArrayBuffer);

        const s3ObjectKey = `${Date.now()}_${file.name}`;
        await uploadDocumentToS3(documentBytes,s3ObjectKey);

        const jobId = await startDocumentTextDetection('gconbucket', s3ObjectKey);

        // Wait for some time for Textract to process the document
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const result = await getDocumentTextDetection(jobId);
        console.log(result);
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={parseDocument}>Parse Document</button>
    </div>
  );
};

export default DocumentParser;
