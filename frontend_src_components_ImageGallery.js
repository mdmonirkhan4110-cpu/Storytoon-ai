import React, { useState } from 'react';

function ImageGallery({ images, onConfirm }) {
  const [confirmedImages, setConfirmedImages] = useState(new Set());

  const toggleConfirm = (id) => {
    const newConfirmed = new Set(confirmedImages);
    if (newConfirmed.has(id)) {
      newConfirmed.delete(id);
    } else {
      newConfirmed.add(id);
    }
    setConfirmedImages(newConfirmed);
  };

  return (
    <div className="image-gallery">
      <h2>জেনারেট করা ছবি</h2>
      <div className="gallery-grid">
        {images.map((img) => (
          <div key={img.id} className="gallery-item">
            <img src={img.imagePath} alt={img.prompt} />
            <p className="prompt-text">{img.prompt}</p>
            <button
              onClick={() => toggleConfirm(img.id)}
              className={`confirm-btn ${confirmedImages.has(img.id) ? 'confirmed' : ''}`}
            >
              {confirmedImages.has(img.id) ? '✓ কনফার্ম' : 'কনফার্ম করুন'}
            </button>
          </div>
        ))}
      </div>
      <button onClick={onConfirm} className="btn-primary" disabled={confirmedImages.size === 0}>
        ভিডিও তৈরি করুন ({confirmedImages.size} টি নির্বাচিত)
      </button>
    </div>
  );
}

export default ImageGallery;