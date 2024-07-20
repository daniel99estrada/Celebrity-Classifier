import { useState } from 'react';
import axios from 'axios';

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        
        if (base64String) {
          // Send base64 string to the Flask API
          const response = await axios.put('http://localhost:5000/classify_image', null, {
            params: {
              image_data: base64String,
            },
          });

          setResult(JSON.stringify(response.data));
        }
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Error uploading image.");
    }
  };

  return (
    <div className="App">
      <h1>Image Classifier</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSubmit}>Upload Image</button>
      {result && <div><h2>Classification Result:</h2><pre>{result}</pre></div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default App;
