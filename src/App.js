import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from './contractABI';
import './App.css';
import Header from './components/Header';
import ConnectWallet from './components/ConnectWallet';
import CreateMemory from './components/CreateMemory';
import MemoryList from './components/MemoryList';
import MemoryDetail from './components/MemoryDetail';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const contractAddress = '0x6c5ba1feb6e4e598aee51ef4fce4dd619f163db0';

  const connectWallet = async () => {
    setError('');
    setLoading(true);
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const accounts = await web3Instance.eth.getAccounts();
        const contractInstance = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setContract(contractInstance);
        setIsConnected(true);
        fetchMemories(contractInstance, accounts[0]);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
          fetchMemories(contractInstance, accounts[0]);
        });
      } else {
        setError('Please install MetaMask to use this application');
      }
    } catch (err) {
      setError('Failed to connect to wallet: ' + err.message);
    }
    setLoading(false);
  };

  const fetchMemories = async (contractInstance, userAccount) => {
    setLoading(true);
    try {
      const memoryIds = await contractInstance.methods.getMyMemories().call({ from: userAccount });
      const accessiblePreviews = await contractInstance.methods.getAccessibleMemoryPreviews().call({ from: userAccount });
      
      setMemories(accessiblePreviews);
    } catch (err) {
      setError('Failed to fetch memories: ' + err.message);
    }
    setLoading(false);
  };

  const createMemory = async (title, content, mediaHash, isPrivate) => {
    setError('');
    setLoading(true);
    try {
      await contract.methods
        .createMemory(title, content, mediaHash, isPrivate)
        .send({ from: account });
      fetchMemories(contract, account);
    } catch (err) {
      setError('Failed to create memory: ' + err.message);
    }
    setLoading(false);
  };

  const viewMemory = async (memoryId) => {
    setError('');
    setLoading(true);
    try {
      const memory = await contract.methods.getMemory(memoryId).call({ from: account });
      setSelectedMemory({
        id: memoryId,
        title: memory.title,
        content: memory.content,
        mediaHash: memory.mediaHash,
        timestamp: memory.timestamp,
        isPrivate: memory.isPrivate,
        creator: memory.creator
      });
    } catch (err) {
      setError('Failed to fetch memory details: ' + err.message);
    }
    setLoading(false);
  };

  const shareMemory = async (memoryId, recipientAddress) => {
    setError('');
    setLoading(true);
    try {
      await contract.methods
        .shareMemory(memoryId, recipientAddress)
        .send({ from: account });
      setError('Memory shared successfully!');
    } catch (err) {
      setError('Failed to share memory: ' + err.message);
    }
    setLoading(false);
  };

  const updatePrivacy = async (memoryId, isPrivate) => {
    setError('');
    setLoading(true);
    try {
      await contract.methods
        .updatePrivacy(memoryId, isPrivate)
        .send({ from: account });
      
      if (selectedMemory && selectedMemory.id === memoryId) {
        setSelectedMemory({
          ...selectedMemory,
          isPrivate: isPrivate
        });
      }
      
      fetchMemories(contract, account);
    } catch (err) {
      setError('Failed to update privacy: ' + err.message);
    }
    setLoading(false);
  };

  const closeMemoryDetail = () => {
    setSelectedMemory(null);
  };

  return (
    <div className="App">
      <Header isConnected={isConnected} account={account} />
      
      <div className="container">
        {error && <div className="error-message">{error}</div>}
        
        {!isConnected ? (
          <ConnectWallet connectWallet={connectWallet} loading={loading} />
        ) : (
          <div className="content">
            <div className="sidebar">
              <CreateMemory createMemory={createMemory} loading={loading} />
            </div>
            
            <div className="main-content">
              {selectedMemory ? (
                <MemoryDetail
                  memory={selectedMemory}
                  account={account}
                  shareMemory={shareMemory}
                  updatePrivacy={updatePrivacy}
                  closeMemoryDetail={closeMemoryDetail}
                  loading={loading}
                />
              ) : (
                <MemoryList 
                  memories={memories} 
                  viewMemory={viewMemory} 
                  loading={loading} 
                  account={account}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 