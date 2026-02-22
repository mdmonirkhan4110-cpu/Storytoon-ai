import React, { useState } from 'react';
import './App.css';
import ScriptInput from './components/ScriptInput';
import ImageGallery from './components/ImageGallery';
import VideoPreview from './components/VideoPreview';
import ProcessingStatus from './components/ProcessingStatus';

function App() {
  const [script, setScript] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [images, setImages] = useState([]);
  const [videoPath, setVideoPath] = useState('');
  const [processingStatus, setProcessingStatus] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleScriptSubmit = async (scriptText) => {
    setScript(scriptText);
    setCurrentStep(2);
    setProcessingStatus('স্ক্রিপ্ট প্রসেস করছি...');

    try {
      const response = await fetch('http://localhost:5000/api/script/split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptText })
      });

      const data = await response.json();
      setPrompts(data.prompts);
      setProcessingStatus(`${data.total_prompts}টি প্রম্পট তৈরি হয়েছে`);
    } catch (error) {
      setProcessingStatus('ত্রুটি: ' + error.message);
    }
  };

  const handleGenerateImages = async () => {
    setCurrentStep(3);
    setProcessingStatus('ছবি জেনারেট করছি... এটি কয়েক মিনিট সময় নিতে পারে');

    const generatedImages = [];

    for (const prompt of prompts) {
      try {
        const response = await fetch('http://localhost:5000/api/script/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: prompt.text, 
            promptId: prompt.id 
          })
        });

        const data = await response.json();
        generatedImages.push({
          id: prompt.id,
          prompt: prompt.text,
          imagePath: data.imagePath,
          confirmed: false
        });

        setImages([...generatedImages]);
        setProcessingStatus(`${generatedImages.length}/${prompts.length} ছবি জেনারেট হয়েছে`);
      } catch (error) {
        console.error('Image generation error:', error);
      }
    }
  };

  const handleConfirmImages = async () => {
    setCurrentStep(4);
    setProcessingStatus('ভিডিও তৈরি করছি...');

    try {
      // এখানে ভিডিও মার্জিং লজিক যোগ করুন
      setVideoPath('process_complete');
      setCurrentStep(5);
      setProcessingStatus('ভিডিও প্রস্তুত!');
    } catch (error) {
      setProcessingStatus('ত্রুটি: ' + error.message);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🎬 স্ক্রিপ্ট টু অ্যানিমে</h1>
        <p>আপনার স্ক্রিপ্টকে এআই দিয়ে অ্যানিমেটেড ভিডিওতে পরিণত করুন</p>
      </header>

      <div className="container">
        <ProcessingStatus status={processingStatus} step={currentStep} />

        {currentStep === 1 && (
          <ScriptInput onSubmit={handleScriptSubmit} />
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <h2>স্ক্রিপ্ট প্রসেস সম্পন্ন</h2>
            <p>{prompts.length} টি প্রম্পট তৈরি হয়েছে</p>
            <button onClick={handleGenerateImages} className="btn-primary">
              ছবি জেনারেট করুন
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <ImageGallery 
            images={images} 
            onConfirm={handleConfirmImages}
          />
        )}

        {currentStep === 5 && (
          <VideoPreview videoPath={videoPath} />
        )}
      </div>
    </div>
  );
}

export default App;