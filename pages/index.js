'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image'

export default function HomePage() {
  // User selects character for the story
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [imageName, setImageName] = useState(false);
  const [animalType, setAnimalType] = useState(false);
  const [instanceType, setInstanceType] = useState(false);
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImageSelected(true);
    if (image === 'image1') {
      setImageName('Oscar');
      setAnimalType('cat');
      setInstanceType('ukj cat');
    } else {
      setImageName('Spot');
      setAnimalType('dog');
      setInstanceType('ced dog');
    }
  }
  
  // User creates a prompt for the story
  const [userPrompt, setUserPrompt] = useState('');
  const handlePromptChange = (e) => {
    setUserPrompt(e.target.value);
  }

  // Ask ChatGPT to write a story based on the prompt
  const [pagesText, setPagesText] = useState('');
  const [imagesText, setImagesText] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const firstPrompt = `Write a 5 page story with 2 sentences on each page for a 10-year-old child. 
    The main character will be called ${imageName}. He is a ${animalType}. The story should be about ${userPrompt}.
    Your response should be in the following format. Do not include any other headers.
    Page 1: XXX
    Page 2: XXX
    Page 3: XXX
    Page 4: XXX
    Page 5: XXX
    `;

    const secondPrompt = (`Then for each page describe an image that would go with it in a story book with only 5 words.
    Do not describe ${imageName}. We already know what he looks like. Your response should be in the following format. Do not include any other headers.
    Page 1: XXX
    Page 2: XXX
    Page 3: XXX
    Page 4: XXX
    Page 5: XXX
    `);

    let responseStr = '';
    console.log(firstPrompt);
    
    try {
      const res = await fetch('/api/story_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstPrompt }),
      });
      const data = await res.json();
      responseStr = data.answer;
      console.log(responseStr);
      let splitResponse = responseStr.split('Page ');
      splitResponse.shift();
  
      let pages_data = {};
      let images_data = {};
  
      splitResponse.forEach((pageText, index) => {
        let [pageNumber, content] = pageText.split(': ');
        pageNumber = pageNumber.trim();
        content = content.trim();
        pages_data[pageNumber] = content;
        images_data[pageNumber] = content;
      });

      console.log(pages_data);
      setPagesText(pages_data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    
    try {
      const res = await fetch('/api/image_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstPrompt, responseStr, secondPrompt }),
      });
      const data = await res.json();
      let imageStr = data.answer;
      console.log(imageStr);
      let splitResponse = imageStr.split('Page ');
      splitResponse.shift();
  
      let images_data = {};

      splitResponse.forEach((pageText, index) => {
        let [pageNumber, content] = pageText.split(': ');
        pageNumber = pageNumber.trim();
        content = content.trim();
        images_data[pageNumber] = content;
      });

      console.log(images_data);
      setImagesText(images_data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load images based on the prompt
  const [loading, setLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});
  const [pagesImages, setPagesImages] = useState({});
  useEffect(() => {
    const fetchImages = async (instanceType) => {
      for (const pageNumber of Object.keys(imagesText)) {
        let content = imagesText[pageNumber];
        
        const additionalText = "a photo of ";
        content = additionalText + instanceType + " " + content;
        console.log(content)
  
        // Set loading to true for this image
        setLoadingImages(prevState => ({ ...prevState, [pageNumber]: true }));
  
        // Fetch image for the page
        try {
          const response = await fetch('https://story-ai-393015.uc.r.appspot.com/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: content }),
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const blob = await response.blob();
          const src = URL.createObjectURL(blob);
  
          // Set imageSrc for the specific page
          setPagesImages(prevState => ({ ...prevState, [pageNumber]: src }));
        } catch (error) {
          console.error('Error:', error.message);
        } finally {
          // Set loading to false for this image, regardless of success or failure
          setLoadingImages(prevState => ({ ...prevState, [pageNumber]: false }));
        }
      }
    };
  
    fetchImages(instanceType);
  }, [imagesText, instanceType]);

  return (
    <div style={{ 
      paddingTop: '100px',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      margin: '0 auto',
      width: '50%'
    }}>
      <p>{"Welcome to our creative storytelling realm! Today, together with our dedicated story writers, we'll guide you in writing and producing a captivating storybook. Let's dive in and give your furry friends the unforgettable narrative they deserve!"}</p>
      <p>{"First, select a character that you would like to write a story about."}</p>
      <div style={{
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '50px'
      }}>
        <Image
          src="/cat.jpg"
          alt="Image 1"
          width={300}
          height={300}
          onClick={() => handleImageClick('image1')}
          style={{
            border: selectedImage === 'image1' ? '2px solid #696969' : '2px solid transparent',
            borderRadius: '20px'
          }} />
        <Image
          src="/dog.jpg"
          alt="Image 2"
          width={300}
          height={300}
          onClick={() => handleImageClick('image2')}
          style={{
            border: selectedImage === 'image2' ? '2px solid #696969' : '2px solid transparent',
            borderRadius: '20px'
          }} />
      </div>
      {imageSelected && (
        <div style={{paddingTop: '20px'}}>
          <p>{"Looks like you've selected " + imageName + ". Now, tell me the type of adventure you want " + imageName + " to go on."}</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <textarea
              value={userPrompt}
              onChange={handlePromptChange}
              placeholder="Write your prompt here"
              rows={3} 
              style={{
                width: '80%', 
                padding: '10px',
                fontSize: '1em', 
                border: '2px solid #000', 
                borderRadius: '5px' 
              }}
            />
            <button
              type="submit"
              disabled={loading} // disable button when loading
              style={{
                margin: '10px 0',
                padding: '10px',
                backgroundColor: loading ? '#ddd' : '#000', 
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1em',
                cursor: loading ? 'default' : 'pointer' 
              }}
            >
              {loading ? 'Our writers are working...' : 'Submit'}
            </button>
          </form>
          <div>
            {Object.keys(pagesText).map((pageNumber) => (
              <div key={pageNumber}>
                <strong>Page {pageNumber}:</strong> {pagesText[pageNumber]}
                {loadingImages[pageNumber] ? (
                  <p>Our illustrators are working...</p> 
                ) : (
                  pagesImages[pageNumber] && 
                  <Image 
                    src={pagesImages[pageNumber]} 
                    alt={`Page ${pageNumber}`} 
                    width={300}
                    height={300}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}