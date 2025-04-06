import React, { useState } from 'react';

function CreateMemory({ createMemory, loading }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaHash, setMediaHash] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    
    if (!content.trim()) {
      setFormError('Content is required');
      return;
    }
    
    // Clear errors and submit
    setFormError('');
    createMemory(title, content, mediaHash, isPrivate);
    
    // Reset form after submission
    setTitle('');
    setContent('');
    setMediaHash('');
    setIsPrivate(true);
  };

  return (
    <div className="card">
      <h2 style={titleStyle}>Create a Memory</h2>
      
      {formError && <div className="error-message">{formError}</div>}
      
      <form onSubmit={handleSubmit} className={loading ? 'loading' : ''}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your memory"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What would you like to remember?"
            rows={5}
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="mediaHash">IPFS Media Hash (optional)</label>
          <input
            type="text"
            id="mediaHash"
            value={mediaHash}
            onChange={(e) => setMediaHash(e.target.value)}
            placeholder="IPFS hash for related media"
          />
          <p style={helpTextStyle}>
            Upload your media to IPFS and paste the hash here
          </p>
        </div>
        
        <div className="form-group" style={privacyGroupStyle}>
          <label style={privacyLabelStyle}>Privacy Setting</label>
          <div style={privacyOptionsStyle}>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                value="private"
                checked={isPrivate}
                onChange={() => setIsPrivate(true)}
              />
              Private
            </label>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                value="public"
                checked={!isPrivate}
                onChange={() => setIsPrivate(false)}
              />
              Public
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? (
            <>
              Creating Memory...
              <span className="loading-spinner"></span>
            </>
          ) : (
            'Save Memory'
          )}
        </button>
      </form>
    </div>
  );
}

const titleStyle = {
  marginBottom: '20px',
  color: '#4a5568',
  fontSize: '20px'
};

const helpTextStyle = {
  fontSize: '12px',
  color: '#718096',
  marginTop: '-10px',
  marginBottom: '15px'
};

const privacyGroupStyle = {
  marginBottom: '20px'
};

const privacyLabelStyle = {
  marginBottom: '10px'
};

const privacyOptionsStyle = {
  display: 'flex',
  gap: '20px'
};

const radioLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  cursor: 'pointer'
};

export default CreateMemory; 