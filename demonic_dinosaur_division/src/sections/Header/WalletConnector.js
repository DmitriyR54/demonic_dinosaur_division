import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { Alert } from "../../components/AlertPopUp/AlertPopUp";
import { truncateAddress } from "../../utils";

// Web3Modal
let web3Connector;

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;

const InitiateConnection = async () => {
  window.Buffer = require("buffer/").Buffer;

  // Create a web3Connector
  web3Connector = new Web3Modal({
    network: "rinkeby",
    cacheProvider: true,
    disableInjectedProvider: true,
    providerOptions: getProviders(),
  });

  setUpView();
  if (web3Connector.cachedProvider) await connectWallet();

  return web3Connector;
};

const getProviders = () => {
  const infuraId = "821e1837c0304463aca81db16fdaa1b9";
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId,
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "Demonic Dinosaur Division NFT", // Required
        infuraId,
      },
    },
    injected: {},
  };

  return providerOptions;
};

const connectWallet = async () => {
  try {
    let cachedProvider = web3Connector.cacheProvider;
    provider = cachedProvider
      ? await web3Connector.connectTo(cachedProvider)
      : await web3Connector.connect();

    subscribeProvider(provider);
    setUpView();

    Alert("success", "Wallet Connected.");
  } catch (error) {
    Alert("info", "Could not get a wallet connection.");
  }
};

const disconnectWallet = async () => {
  // Unsubscribe from providers
  if (provider.removeListener) {
    provider.removeListener("connect", () => {});
    provider.removeListener("disconnect", () => {});
  }

  if (provider.close) {
    try {
      await provider.close();
    } catch (error) {
      console.log(error);
    } finally {
      setUpView();
      Alert("success", "Wallet disconnected.");
    }
  }
  await web3Connector.clearCachedProvider();

  provider = null;
  selectedAccount = null;
};

const subscribeProvider = () => {
  if (provider.on) {
    // Subscribe to provider connection
    provider.on("connect", (info) => {
      console.log("connected", info);
      fetchAccountData();
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error) => {
      console.log("disconnect", error);
      disconnectWallet();
    });
  }
};

const fetchAccountData = async () => {
  const web3library = new Web3(provider);
  // console.log(provider, await web3library.eth.getAccounts());
  selectedAccount = provider.accounts[0];
};

const setUpView = async () => {
  const walletInfoBtn = document.querySelector("#wallet-info");
  const connectWalletBtn = document.querySelector("#connect-wallet");
  const walletInfoAddressInput = document.querySelector(
    "#wallet-info #address"
  );
  connectWalletBtn.style.display = "flex";
  walletInfoBtn.style.display = "none";

  if (provider?.connected) {
    // Extract Data from the provider
    fetchAccountData();

    connectWalletBtn.style.display = "none";
    walletInfoBtn.style.display = "flex";
    walletInfoAddressInput.innerText = truncateAddress(selectedAccount);
  }
};

export {
  InitiateConnection,
  connectWallet,
  disconnectWallet,
  selectedAccount,
  provider,
};
