import React from 'react';

function Header({ isConnected, account }) {
  return (
    <header style={headerStyle}>
      <div className="container" style={containerStyle}>
        <h1 style={titleStyle}>Memory Sharing Platform</h1>
        {isConnected && (
          <div style={accountStyle}>
            <span style={accountLabelStyle}>Connected:</span>
            <span style={accountAddressStyle}>
              {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

const headerStyle = {
  backgroundColor: '#5a67d8',
  color: 'white',
  padding: '15px 0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const titleStyle = {
  margin: 0,
  fontSize: '24px',
  fontWeight: '600'
};

const accountStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const accountLabelStyle = {
  fontSize: '14px',
  opacity: '0.9'
};

const accountAddressStyle = {
  backgroundColor: 'rgba(255,255,255,0.2)',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: '500'
};

export default Header; 