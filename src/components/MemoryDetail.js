import React, { useState } from 'react';

function MemoryDetail({ memory, account, shareMemory, updatePrivacy, closeMemoryDetail, loading }) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sharingError, setSharingError] = useState('');
  
  const isOwner = memory.creator.toLowerCase() === account.toLowerCase();
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  const handleShare = (e) => {
    e.preventDefault();
    
    // Validate Ethereum address (simple validation)
    if (!recipientAddress.trim() || !recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
      setSharingError('Please enter a valid Ethereum address');
      return;
    }
    
    setSharingError('');
    shareMemory(memory.id, recipientAddress);
    setRecipientAddress('');
  };
  
  const handlePrivacyToggle = () => {
    updatePrivacy(memory.id, !memory.isPrivate);
  };
  
  return (
    <div className={`card ${loading ? 'loading' : ''}`}>
      <button className="btn-secondary back-button" onClick={closeMemoryDetail}>
        &larr; Back to Memories
      </button>

      <div className="memory-header">
        <h2 className="memory-title">{memory.title}</h2>
        <span className={`privacy-tag ${memory.isPrivate ? 'private' : 'public'}`}>
          {memory.isPrivate ? 'Private' : 'Public'}
        </span>
      </div>
      
      <p className="memory-creator">
        {isOwner 
          ? 'Created by you' 
          : `Created by: ${memory.creator}`
        } 
        on {formatDate(memory.timestamp)}
      </p>
      
      <div className="memory-content">
        {memory.content}
      </div>
      
      {memory.mediaHash && (
        <div>
          <h3 style={mediaHeaderStyle}>Attached Media:</h3>
          <a 
            href={`https://ipfs.io/ipfs/${memory.mediaHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ipfs-link"
          >
            View on IPFS
          </a>
        </div>
      )}
      
      {isOwner && (
        <div className="memory-actions">
          <button 
            className={`btn-${memory.isPrivate ? 'primary' : 'secondary'}`}
            onClick={handlePrivacyToggle}
            disabled={loading}
          >
            Make {memory.isPrivate ? 'Public' : 'Private'}
          </button>
          
          <div style={sharingContainerStyle}>
            <h3 style={sharingHeaderStyle}>Share this Memory</h3>
            {sharingError && <div className="error-message">{sharingError}</div>}
            
            <form onSubmit={handleShare} className="share-form">
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Enter recipient's Ethereum address"
              />
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                Share
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const mediaHeaderStyle = {
  fontSize: '16px',
  marginBottom: '8px',
  marginTop: '20px',
  color: '#4a5568'
};

const sharingContainerStyle = {
  marginTop: '30px',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px'
};

const sharingHeaderStyle = {
  fontSize: '16px',
  marginBottom: '15px',
  color: '#4a5568'
};

export default MemoryDetail; 