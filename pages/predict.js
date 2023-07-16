import { useState } from 'react';

const YourComponent = () => {
  const [imageSrc, setImageSrc] = useState('');

  const handlePredict = async () => {
    const url = 'https://story-ai-393015.uc.r.appspot.com/predict';
    const data = { prompt: 'ced dog in the ocean' };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      console.log(blob)
      const src = URL.createObjectURL(blob);
      setImageSrc(src);
      console.log('Image loaded successfully!');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <button onClick={handlePredict}>Predict</button>
      {imageSrc && <img src={imageSrc} alt="Generated Image" />}
    </div>
  );
};

export default YourComponent;