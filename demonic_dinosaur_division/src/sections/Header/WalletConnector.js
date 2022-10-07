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
    cacheProvider: true,
    providerOptions: getProviders(),
    // disableInjectedProvider: true,
    theme: {
      background: "rgb(187, 0, 14)",
      hover: "rgb(17, 17, 17)",
      main: "rgb(255, 255, 255)",
      secondary: "rgb(234, 234, 234)",
      border: "rgb(187, 0, 14)",
    },
  });

  setUpView();
  if (web3Connector.cachedProvider) await connectWallet();

  return web3Connector;
};

const getProviders = () => {
  const infuraId = process.env.INFURA_ID;
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
    let cachedProvider = web3Connector.cachedProvider;
    await web3Connector.clearCachedProvider();
    // console.log("Cached provider: ", cachedProvider)

    provider = cachedProvider
      ? await web3Connector.connectTo(cachedProvider)
      : await web3Connector.connect();

    subscribeProvider(provider);
    setUpView();

    Alert("success", "Wallet Connected.");
  } catch (error) {
    console.log(error);
    await web3Connector.clearCachedProvider();
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
    }
  }

  await web3Connector.clearCachedProvider();
  provider = null;
  selectedAccount = null;

  setUpView();
  Alert("info", "Wallet disconnected.");
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

  let accounts = await web3library.eth.getAccounts();
  selectedAccount = accounts[0];
};

const setUpView = async () => {
  const walletInfoBtn = document.querySelector("#wallet-info");
  const connectWalletBtn = document.querySelector("#connect-wallet");
  const walletInfoAddressInput = document.querySelector(
    "#wallet-info #address"
  );
  connectWalletBtn.style.display = "flex";
  walletInfoBtn.style.display = "none";

  if (provider) {
    // Extract Data from the provider
    await fetchAccountData();

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
