import React, { useState, useEffect } from "react";

import { ethers, utils } from "ethers";

import abi from "./contracts/PandaCoin.json";
import Head from "next/head";

const Layout = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState("0");
  const [isOwner, setIsOwner] = useState(false);

  const [inputValue, setInputValue] = useState({
    mintTo: "",
    mintAmount: "",
    burnAmount: "",
    sendTo: "",
    sendAmount: "",
  });

  const contractAddress: string = "0xB70EF3d71a3d5000519c340b4E5b590569e5dA3b";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const pandaCoinContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];

        setIsWalletConnected(true);
        setCurrentAccount(account);

        console.log("Connected Wallet:", account);

        // account balance
        const acctBalance = await pandaCoinContract.myTokenBalance();
        const weiToEther = utils.formatEther(acctBalance);
        setAccountBalance(parseInt(weiToEther).toFixed(2));
        console.log("PAC Token Balance:", weiToEther);

        // check isOwner
        const deployer = await pandaCoinContract.owner();
        if (account === deployer.toString().toLowerCase()) {
          setIsOwner(true);
          console.log("You're the owner of the contract");
        }
      } else {
        alert("Connect your Ethereum Wallet");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mintPAC = async (event: any) => {
    try {
      event.preventDefault();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const pandaCoinContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      if (isWalletConnected) {
        const txn = await pandaCoinContract.mint(
          inputValue.mintTo,
          inputValue.mintAmount
        );
        console.log(`Minting PAC to ${inputValue.mintTo}...`);
        await txn.wait();
        console.log("PAC minted...done", txn.hash);
      } else {
        alert(
          "You're not the owner, only the owner can mint new tokens, you can request PAC instead."
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const burnPAC = async (event: any) => {
    try {
      event.preventDefault();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const pandaCoinContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      if (isWalletConnected) {
        const txn = await pandaCoinContract.burn(inputValue.burnAmount);
        console.log(`Burning ${inputValue.burnAmount} PAC...`);
        await txn.wait();
        console.log(
          `${inputValue.burnAmount} PAC burned...completed`,
          txn.hash
        );
      } else {
        alert("You're not the owner, only the owner can burn tokens.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const requestPAC = async (event: any) => {
    try {
      event.preventDefault();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const pandaCoinContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      if (isWalletConnected) {
        const txn = await pandaCoinContract.requestToken(
          inputValue.sendTo,
          inputValue.sendAmount
        );
        console.log(`Requesting ${inputValue.sendAmount} PAC...`);
        await txn.wait();
        console.log(
          `${inputValue.sendAmount} PAC sent to ${inputValue.sendTo}...done`,
          txn.hash
        );
      } else {
        alert("Connect your wallet first to request PAC tokens.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event: any) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <>
      <Head>
        <title>PandaCoin (PAC) - get an ERC20 token for free</title>
      </Head>
      <div className="contain">
        {/* Title */}
        <div className="box1 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
          <img src="panda.png" width={100} height={100} alt="panda" />

          <h1 className="title text-slate-50">PandaCoin</h1>
        </div>

        {/* Connect Wallet Button */}
        <div className="box2 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
          {!isWalletConnected ? (
            <button
              className="btn1 px-5 py-3 text-md text-slate-50 bg-blue-500 hover:bg-blue-600 font-semibold rounded-full"
              onClick={checkIfWalletIsConnected}
            >
              Connect Wallet
            </button>
          ) : (
            <p className="txt text-xl font-medium">
              Connected Wallet <br />{" "}
              <span className="text-xs">{currentAccount}</span>
            </p>
          )}
          <br />
          <br />
          <img src="plug.png" width={50} height={50} alt="plug" />
        </div>

        {/* request PAC tokens */}
        <div className="box3 col-span-4 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
          <label htmlFor="user" className="txt text-xl font-medium text-black">
            Request PandaCoin (PAC)
          </label>
          <br />
          <input
            type="text"
            name="sendTo"
            id="sendTo"
            placeholder="Type the address to send to"
            onChange={handleInputChange}
            value={inputValue.sendTo}
          />
          <br />
          <input
            type="number"
            name="sendAmount"
            id="sendAmount"
            placeholder="Type the number of PAC"
            onChange={handleInputChange}
            value={inputValue.sendAmount}
          />
          <br />
          <button
            type="submit"
            className="px-4 py-2 text-sm text-slate-50 bg-blue-500 hover:bg-blue-600 font-semibold rounded-full"
            onClick={requestPAC}
            disabled={isOwner ? true : false}
          >
            Request Token
          </button>
          <br />
          <p className="disclaimer">
            <b>Info:</b> You can request a <b>max of 10 PandaCoin (PAC)</b> at a
            time. <br /> Anyone can request PandaCoin (PAC) for <b>Free</b>,
            it'll automatically being sent to your wallet from Kausik's wallet.
          </p>
        </div>

        {/* account balance */}
        <div className="box4 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
          <p className="txt text-xl font-medium text-black">
            Your have <br /> {accountBalance} PandaCoin (PAC)
          </p>
        </div>

        {/* mint new token */}
        <div className="box5 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
          <p className="txt text-xl font-medium text-black">
            Mint PandaCoin (PAC)
          </p>
          <br />
          <input
            type="text"
            name="mintTo"
            id="mintTo"
            placeholder="Type the address to send to"
            onChange={handleInputChange}
            value={inputValue.mintTo}
            disabled={!isOwner ? true : false}
          />
          <br />
          <input
            type="number"
            name="mintAmount"
            id="mintAmount"
            placeholder="Type the number of PAC"
            onChange={handleInputChange}
            value={inputValue.mintAmount}
            disabled={!isOwner ? true : false}
          />
          <br />

          <button
            className={
              !isOwner
                ? "px-4 py-2 text-sm text-slate-50 bg-zinc-400 hover:bg-zinc-400 font-semibold rounded-full"
                : "px-4 py-2 text-sm text-slate-50 bg-blue-500 hover:bg-blue-600 font-semibold rounded-full"
            }
            onClick={mintPAC}
            disabled={!isOwner ? true : false}
          >
            Mint Token
          </button>
          <br />

          <p className="disclaimer">
            <b>Info:</b> Only the creator of the PandaCoin (PAC) can mint new
            tokens.
          </p>
        </div>

        {/* burn token */}
        <div className="box6 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
          <label
            htmlFor="deposit"
            className="txt text-xl font-medium text-black"
          >
            Burn PandaCoin (PAC)
          </label>
          <br />
          <input
            type="number"
            name="burnAmount"
            id="burnAmount"
            placeholder="Type the number of PAC to burn"
            onChange={handleInputChange}
            value={inputValue.burnAmount}
            disabled={!isOwner ? true : false}
          />
          <br />
          <button
            type="submit"
            className={
              !isOwner
                ? "px-4 py-2 text-sm text-slate-50 bg-zinc-400 hover:bg-zinc-400 font-semibold rounded-full"
                : "px-4 py-2 text-sm text-slate-50 bg-blue-500 hover:bg-blue-600 font-semibold rounded-full"
            }
            onClick={burnPAC}
            disabled={!isOwner ? true : false}
          >
            Burn Token
          </button>
          <br />
          <p className="disclaimer">
            <b>Info:</b> Only the creator of the PandaCoin (PAC) can burn
            tokens.
          </p>
        </div>

        {/* built by */}
        <div className="box7 p-8 max-w-sm mx-auto bg-purple-200 rounded-xl shadow-lg flex flex-col items-center ">
          <p className="txt text-xl font-medium text-black">
            Coded by{" "}
            <a href="https://www.kausikdas.com" target="_blank">
              Kausik Das ✪
            </a>
          </p>
        </div>

        {/* Instructions */}
        <div className="box8 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
          <p>
            <b>How to display PandaCoin (PAC) on my wallet ?</b>
          </p>
          <br />
          <p className="disclaimer">
            To add this token on your wallet, open your Metamask wallet, go to{" "}
            <b>Assets</b> section, click on <b>Import tokens</b>. Then on the{" "}
            <b>Import Tokens</b> form add this contract address{" "}
            <b>
              <i>0xB70EF3d71a3d5000519c340b4E5b590569e5dA3b</i>
            </b>{" "}
            to the <b>Token Contract Address</b> field. It'll automatically
            generate rest of the details of the token and then click on{" "}
            <b>Add Custom Token</b> button to import PAC on your wallet.
          </p>
        </div>
      </div>
    </>
  );
};

export default Layout;
