import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Copyright from "./components/Copyright";
import Explore from "./components/Explore";

import useWeb3 from "./useWeb3";
import { useStoreApi } from "./storeApi";

import { useState, useEffect } from "react";

import Cookies from "universal-cookie";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const ethereum_address = require("ethereum-address");

//stores information about entire "blockhain"
const initialFormData = Object.freeze([]);

//stores the information about current user
const initialUser = Object.freeze({
  address: "",
  createdAt: "",
  balance: 0,
  transactions: [
    /*{
      to: "",
      howMany: 0,
      when: "",
    },*/
  ],
  transactionsIn: [
    /*   {
      from: "",
      howMany: 0,
      when: "",
    },*/
  ],
});

const App = () => {
  const [AddrHistory, ADD_Address] = useState(
    JSON.parse(localStorage.getItem("BlockChain")) || initialFormData
  );
  const [CurrentUser, SetUSer] = useState(initialUser);

  useEffect(() => {
    localStorage.setItem("BlockChain", JSON.stringify(AddrHistory));
  }, [AddrHistory]);



  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
  }

  
  //cookies logic...
  if (!ethereum_address.isAddress(CurrentUser.address)) {
    const cookies = new Cookies();
    const addr = cookies.get("address");
    if (ethereum_address.isAddress(addr)) {
      let addressExists = false;
      var user;
      AddrHistory.map((target, move) => {
        if (target.address === addr) {
          addressExists = true;
          user = target;
        }
        return "";
      });
      if (!addressExists) {
        user = {
          address: addr,
          createdAt: new Date().getTime(),
          balance: 0,
          transactions: [],
          transactionsIn: [],
        };

        ADD_Address([...AddrHistory, user]);
      }
      SetUSer(user);
    } else {
      //invalid cookie
      cookies.remove("address");
    }
  }




//https://github.com/PiotrNap/YouTube-channel-source-code/blob/374a09136b302983248245284af130be4d347d34/React-metamask-intro/src/App.js
  const { balance, address, message, setAddress, setBalance } = useStoreApi();
  const web3 = useWeb3();

  // get user account on button click
  const getUserAccount = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        web3.eth.getAccounts().then(accounts => {
          setAddress(accounts[0]);
          updateBalance(accounts[0]);
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Metamask extensions not detected!");
    }
  };

  const updateBalance = async fromAddress => {
    await web3.eth.getBalance(fromAddress).then(value => {
      setBalance(web3.utils.fromWei(value, "ether"));
    });
  };

  const sendTransaction = async (to, bal) => {
    const amount = bal;
    const recipient = to;
    await web3.eth.sendTransaction({
      from: address,
      to: recipient,
      value: web3.utils.toWei(amount, "ether")
    });
    updateBalance(address);
  };


  //minting
  const handleMint = (bal) => {
    const tempHistory = AddrHistory.map((element) => {
      if (element.address === CurrentUser.address) {
        element.balance += bal * 1;
        element.transactionsIn = [
          ...element.transactionsIn,
          {
            from: "MINT",
            howMany: bal * 1,
            when: new Date().getTime(),
          },
        ];
      }
      return element;
    });
    ADD_Address(tempHistory);

    return true;
  };

  //transfer funds
  const handleTransfer = (to, bal) => {
    sendTransaction(to, bal);

    let success = false;
    bal = bal * 1;
    const tempHistory = AddrHistory.map((element) => {
      if (element.address === CurrentUser.address && element.balance >= bal) {
        success = true;
        element.balance -= bal;
        element.transactions = [
          ...element.transactions,
          {
            to: to,
            howMany: bal,
            when: new Date().getTime(),
          },
        ];
      }
      return element;
    });
    if (!success) return false;
    else {
      ADD_Address(tempHistory);
      var addressExists = false;

      AddrHistory.map((target, move) => {
        if (target.address === to) {
          addressExists = true;
        }
        return null;
      });

      if (!addressExists) {
        ADD_Address([
          ...AddrHistory,
          {
            address: to,
            createdAt: new Date().getTime(),
            balance: bal,
            transactions: [],
            transactionsIn: [
              {
                from: CurrentUser.address,
                howMany: bal,
                when: new Date().getTime(),
              },
            ],
          },
        ]);
      } else {
        const tempHistory2 = AddrHistory.map((element) => {
          if (element.address === to) {
            element.balance += bal;
            element.transactionsIn = [
              ...element.transactionsIn,
              {
                from: CurrentUser.address,
                howMany: bal,
                when: new Date().getTime(),
              },
            ];
          }
          return element;
        });

        ADD_Address(tempHistory2);
      }
      return true;
    }
  };

  //after successful login add new address if it doesn't exist
  const onLoginSuccess = (addr) => {
    var addressExists = false;
    let user;
    AddrHistory.map((target, move) => {
      if (target.address === addr) {
        addressExists = true;
        user = target;
      }
      return null;
    });

    if (!addressExists) {
      console.log("adding user");

      user = {
        address: addr,
        createdAt: new Date().getTime(),
        balance: 0,
        transactions: [],
        transactionsIn: [],
      };

      ADD_Address([...AddrHistory, user]);
    }

    SetUSer(user);

    getUserAccount();
  };

  const newAddress = (addr) => {
    var addressExists = false;
    var user;
    AddrHistory.map((target, move) => {
      if (target.address === addr) {
        addressExists = true;
        user = target;
      }
      return null;
    });

    if (!addressExists) {
      user = {
        address: addr,
        createdAt: new Date().getTime(),
        balance: 0,
        transactions: [],
        transactionsIn: [],
      };
      console.log("add user");
      ADD_Address([...AddrHistory, user]);
    }
    return user;
  };

  return (
    <Router>
      <div id="main" className="App">
        {CurrentUser.address === "" ? (
          <Redirect to="/" />
        ) : (
          <Redirect to="/Dashboard" />
        )}

        <Switch>
          <Route exact path="/">
            <Login onLoginSuccess={onLoginSuccess} CurrentUser={CurrentUser} />
          </Route>

          <Route path="/Dashboard">
            <Dashboard
              Address={CurrentUser}
              AddrHistory={AddrHistory}
              handleMint={handleMint}
              handleTransfer={handleTransfer}
            />
          </Route>

          <Route path="/Explore">
            <Explore newAddress={newAddress} Address={CurrentUser} />
          </Route>
        </Switch>

        <Copyright />
      </div>
    </Router>
  );
};

export default App;
