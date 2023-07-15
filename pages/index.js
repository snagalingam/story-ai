'use client'

import { useState } from 'react';

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  }
  const [userPrompt, setUserPrompt] = useState('');

  const handlePromptChange = (e) => {
    setUserPrompt(e.target.value);
  }

  const [pagesText, setPagesText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gpt4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userPrompt }),
      });
      const data = await res.json();

      // Separate the text into pages
      let responseStr = data.answer;
      let splitResponse = responseStr.split('Page ');
      splitResponse.shift();
      let pages_data = {};
      splitResponse.forEach(pageText => {
        let [pageNumber, content] = pageText.split(': ');
        pages_data[pageNumber.trim()] = content;
      });

      setPagesText(pages_data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      margin: '0 auto'
    }}>
      <h1>Select an Image</h1>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '100px' 
      }}>
        <img
          src="/cat.jpg" 
          alt="Image 1"
          onClick={() => handleImageClick('image1')}
          style={{ 
            border: selectedImage === 'image1' ? '2px solid #696969' : '2px solid transparent',
            maxWidth: '300px',
            maxHeight: '300px',
            borderRadius: '20px'
          }}
        />
        <img
          src="/05.jpg" 
          alt="Image 2"
          onClick={() => handleImageClick('image2')}
          style={{ 
            border: selectedImage === 'image2' ? '2px solid #696969' : '2px solid transparent',
            maxWidth: '300px',
            maxHeight: '300px',
            borderRadius: '20px'

          }}
        />
      </div>
      <h1>Submit a Prompt</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={userPrompt} 
          onChange={handlePromptChange} 
          placeholder="Write your prompt here"
          style={{ width: '100%', padding: '10px' }}
        />
        <button type="submit" style={{ margin: '10px 0', padding: '10px' }}>
          Submit
        </button>
      </form>
      <div>
        {Object.keys(pagesText).map((pageNumber) => (
          <p key={pageNumber}>
            <strong>Page {pageNumber}:</strong> {pagesText[pageNumber]}
          </p>
        ))}
      </div>
    </div>
  )
}