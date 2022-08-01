import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants

const TWITTER_HANDLE = 'FredCathey23';
const TWITTER_LINK = `https://twitter.com/FredCathey23`;
const TEST_GIFS = [
  'https://c.tenor.com/hN-r_0XIQaIAAAAC/raphtalia-sword.gif',
  'https://i.redd.it/lhke79b1qo491.gif',
  'https://i.redd.it/r4upeatupo491.gif'
]


const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
  if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  
    const onInputChange = (event) => {
      const { value } = event.target;
      setInputValue(value);
    };

    const sendGif = async () => {
      if (inputValue.length > 0) {
        console.log('Gif link: ', inputValue);
        setGifList([...gifList, inputValue]);
        setInputValue('');
      } else {
        console.log('Empty input. Try again.');
      }
    };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );



  useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);

useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);
    //error on this function
  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input type="text" 
          placeholder="Enter gif link!" 
          value={inputValue} 

          onChange={onInputChange} 
          />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header"> ⚔️ Raphtalia gifs</p>
          <p className="sub-text">
            View Raphtalia GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}

          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
