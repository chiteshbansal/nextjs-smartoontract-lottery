import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

function ManualHeader(props) {
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();
  //    let connected =false

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window != undefined) {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log("Account changed to ", account);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("NO account found");
      }
    });
  }, []);
  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)} ...{" "}
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
            if (typeof window != undefined)
              window.localStorage.setItem("connected", "injected");
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
}

export default ManualHeader;
