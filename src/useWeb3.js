import { useEffect, useState } from "react";
import Web3 from "web3";

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    var instance;
    if (window.ethereum) {
      // set up a new provider
      try {
        instance = new Web3(window.ethereum);
      } catch (error) {
        console.error(error);
      }
    } else if (window.web3) {
      instance = new Web3(window.web3);
    } else {
      // fallback on localhost provider for ganache
      //const provider = new Web3.provider.HttpProvider("http://127.0.0.1:8545");

      const provider = new Web3.provider.HttpProvider(
        "https://ropsten.infura.io/v3/f70dbabf3a324ede815b26eee5b9365e"
      );

      instance = new Web3(provider);
    }
    setWeb3(instance);
  }, []);
  return web3;
};

export default useWeb3;
