import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Web3modal from 'web3modal';
import { providers, Contract } from 'ethers';
import { useEffect, useRef, useState, useStatic } from 'react';
import { WHITELIST_CONTRACT_ADDRESS, ABI } from '../constants';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3modalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3modalRef.current.connect();
    const web3provider = new providers.Web3Provider(provider);

    const { chainId } = await web3provider.getNetwork();
    if (chainId !== 4) {
      window.alert('change the network to Rinkeby');
      throw new Error('change network to Rinkeby');
    }

    if (needSigner) {
      const signer = web3provider.getSigner();
      return signer;
    }
    return web3provider;
  };

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const WhitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        signer
      );

      const tx = await WhitelistContract.addAddressToWhitelist();
      setLoading(true);

      await tx.wait();
      setLoading(false);

      await getNumberOfWhitelist();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelist = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        provider
      );

      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        signer
      );

      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );

      setJoinedWhitelist(_joinedWhitelist);
    } catch (e) {
      console.error(e);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelist();
    } catch (e) {
      console.error(e);
    }
  };

  const renderbutton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return;
        <div className={styles.description}>
          Thanks for joining the whitelist
        </div>;
      } else if (loading) {
        return <button className={styles.button}>Loading</button>;
      } else {
        return (
          <button className={styles.button} onClick={addAddressToWhitelist}>
            join the whitelist
          </button>
        ); //
      }
    } else {
      return (
        <button className={styles.button} onClick={connectWallet}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3modalRef.current = new Web3modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto devs</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the whitelist
          </div>
          {renderbutton()}
        </div>

        <div>
          <img className={styles.image} src="./crypto-devs.svg " />
        </div>
      </div>

      <footer className={styles.footer}>
        made with &#10084 by Crypto Devs
      </footer>
    </div>
  );
}
