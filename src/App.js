import React, { useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
import abi from './abi.json'
import proxyAbi from './proxyContractAbi.json'

function App() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [owner, setOwner] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [SendFnHash,setSendFnHash] = useState("")
  const ContractABI = abi;
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setConnected(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.error('MetaMask extension not detected');
    }
  };

  const getSmartWalletOwner = async () => {
    try {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0x7c225EE78F329f8FCcB3FE4822122Fb6243C6e5c'; // Replace with your SmartWallet contract address
      const abi = ContractABI;
      const smartWalletContract = new ethers.Contract(contractAddress, abi, signer);
     const owner = await smartWalletContract.owner()
     console.log(owner); 
     setOwner(owner)
     console.log("contrac load");



  
    } catch (error) {
      console.error('Error setting owner:', error);
    }
  };
  const sendEther = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0x7c225EE78F329f8FCcB3FE4822122Fb6243C6e5c'; // Replace with your SmartWallet contract address
      const abi = ContractABI
      const smartWalletContract = new ethers.Contract(contractAddress, abi, signer);

      const amountToSend = ethers.utils.parseEther(amount);
      console.log("..............",amount,recipientAddress);
     const sendFn =  await smartWalletContract.sendEther(recipientAddress, amountToSend);
     setSendFnHash(sendFn.hash)
      console.log('Ether sent successfully:', amount, 'ETH to', recipientAddress);
    } catch (error) {
      console.error('Error sending ether:', error);
    }
  };

  const createNewWallet = async () => {
    try {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0x9ad848929D70daeCF0f9b429C234575183f12FeF'; // Replace with your SmartWallet contract address
      const abi = proxyAbi;
      const proxyContract = new ethers.Contract(contractAddress, abi, signer);

     const creatingWallet = await proxyContract.createSmartWallet()

     
     console.log(creatingWallet.hash); 
     
     console.log("contrac load");



  
    } catch (error) {
      console.error('Error setting owner:', error);
    }
  };

  const distroyWallet = async () => {
    try {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0x9ad848929D70daeCF0f9b429C234575183f12FeF'; // Replace with your SmartWallet contract address
      const abi = proxyAbi;
      const proxyContract = new ethers.Contract(contractAddress, abi, signer);

     const distroyWallet = await proxyContract.destroySmartWallet()
     
     console.log(distroyWallet.hash); 
     setOwner(owner)
     console.log("contrac load");



  
    } catch (error) {
      console.error('Error setting owner:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SmartWallet Integration</h1>
        {connected ? (
          <div>
            <p>Connected Account: {account}</p>
          
        
            <button onClick={getSmartWalletOwner}>Get Owner</button>
            <br />
            <p> Owner Address : {owner}</p>
            <br />

            <input
              type="text"
              placeholder="Enter recipient address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
            
            <input
              type="text"
              placeholder="Enter amount (ETH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={sendEther}>Send Ether</button>
                      
            {SendFnHash ? <p>Send Ether Function Hash : {SendFnHash}</p> : ""}
            <button onClick={createNewWallet}> Create new wallet</button><br/>
            <button onClick={distroyWallet}> Distroy Wallet</button>

          </div>

          
        ) : (
          <button onClick={connectMetaMask}>Connect MetaMask</button>
        )
        
        
        }


        
      </header>
      
      
    </div>
  );
}

export default App;
