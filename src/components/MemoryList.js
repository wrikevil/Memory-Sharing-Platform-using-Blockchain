import React from 'react';

function MemoryList({ memories, viewMemory, loading, account }) {
  // Function to format the timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Function to shorten Ethereum addresses
  const shortenAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Check if the memory is created by the current user
  const isOwnMemory = (creator) => {
    return creator.toLowerCase() === account.toLowerCase();
  };

  return (
    <div className={loading ? 'loading' : ''}>
      <h2 style={titleStyle}>Your Memories</h2>
      
      {memories.length === 0 ? (
        <div className="card" style={emptyStateStyle}>
          <p>You don't have any memories yet. Create your first memory!</p>
        </div>
      ) : (
        memories.map((memory) => (
          <div 
            key={memory.id} 
            className="card memory-item" 
            onClick={() => viewMemory(memory.id)}
          >
            <div className="memory-header">
              <h3 className="memory-title">
                {memory.title}
                <span className={`privacy-tag ${memory.isPrivate ? 'private' : 'public'}`}>
                  {memory.isPrivate ? 'Private' : 'Public'}
                </span>
              </h3>
            </div>
            <div style={metaInfoStyle}>
              <span>{formatDate(memory.timestamp)}</span>
              {!isOwnMemory(memory.creator) && (
                <span style={creatorInfoStyle}>
                  Created by: {shortenAddress(memory.creator)}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const titleStyle = {
  marginBottom: '20px',
  color: '#4a5568',
  fontSize: '20px'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '40px 20px',
  color: '#718096'
};

const metaInfoStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: '#718096',
  marginTop: '8px'
};

const creatorInfoStyle = {
  fontStyle: 'italic'
};

export default MemoryList; 