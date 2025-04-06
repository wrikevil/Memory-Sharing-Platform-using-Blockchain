import React from 'react';

function ConnectWallet({ connectWallet, loading }) {
  return (
    <div className="card" style={containerStyle}>
      <div style={contentStyle}>
        <h2 style={titleStyle}>Welcome to the Memory Sharing Platform</h2>
        <p style={descriptionStyle}>
          Store your memories securely on the blockchain. Share them with friends and family, or keep them private. Your memories, your control.
        </p>
        <div style={metamaskInfoStyle}>
          <p style={noteStyle}>You'll need MetaMask to use this application.</p>
          <p style={networkStyle}>Please connect to the EduChain Testnet.</p>
        </div>
        <button 
          className="btn-primary" 
          style={buttonStyle} 
          onClick={connectWallet}
          disabled={loading}
        >
          {loading ? (
            <>
              Connecting...
              <span className="loading-spinner"></span>
            </>
          ) : (
            'Connect with MetaMask'
          )}
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  maxWidth: '600px',
  margin: '100px auto',
  textAlign: 'center'
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '30px'
};

const titleStyle = {
  marginBottom: '20px',
  color: '#4a5568',
  fontSize: '28px'
};

const descriptionStyle = {
  marginBottom: '30px',
  lineHeight: '1.6',
  color: '#718096'
};

const metamaskInfoStyle = {
  marginBottom: '25px',
  padding: '15px',
  backgroundColor: '#ebf4ff',
  borderRadius: '8px',
  width: '100%'
};

const noteStyle = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#4c51bf',
  marginBottom: '5px'
};

const networkStyle = {
  fontSize: '14px',
  color: '#5a67d8'
};

const buttonStyle = {
  padding: '12px 24px',
  fontSize: '16px'
};

export default ConnectWallet; 