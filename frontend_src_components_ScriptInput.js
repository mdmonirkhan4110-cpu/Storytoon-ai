import React, { useState } from 'react';

function ScriptInput({ onSubmit }) {
  const [script, setScript] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (script.trim()) {
      onSubmit(script);
    }
  };

  return (
    <div className="script-input">
      <h2>আপনার ভিডিও স্ক্রিপ্ট লিখুন</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="আপনার স্ক্রিপ্ট এখানে লিখুন..."
          rows="10"
          className="script-textarea"
        />
        <button type="submit" className="btn-primary">
          স্ক্রিপ্ট প্রসেস করুন
        </button>
      </form>
    </div>
  );
}

export default ScriptInput;