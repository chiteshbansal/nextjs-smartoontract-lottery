import { useMoralis, useWeb3Contract } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
function LotteryEntrance(props) {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const [entranceFee, setEntranceFee] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const [numPlayers, setNumPlayers] = useState(0);

  const dispatch = useNotification();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  console.log(chainId, raffleAddress);
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    params: {},
    functionName: "enterRaffle",
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    params: {},
    functionName: "getEntranceFee",
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    params: {},
    functionName: "getNumberOfPlayers",
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    params: {},
    functionName: "getRecentWinner",
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  async function updateUI() {
    const raffleEntranceFee = (await getEntranceFee()).toString();
    const numPlayers = (await getNumberOfPlayers()).toString();
    const recentWinner = await getRecentWinner();

    setRecentWinner(recentWinner);
    setNumPlayers(numPlayers);
    setEntranceFee(raffleEntranceFee);
  }
  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };
  return (
    <div>
      Lottery Entrance{" "}
      {raffleAddress ? (
        <div className="p-2">
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-auto rounded "
              disabled={isLoading || isFetching}
              onClick={async () => {
                await enterRaffle({
                  onSuccess: handleSuccess,
                  onError: (error) => {
                    return console.log(error);
                  },
                });
              }}
            >
              {isLoading || isFetching ?  <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>:(<div> Enter Raffle</div>)}
            </button>
          </div>
          Entrance Fee : {ethers.utils.formatEther(entranceFee)} eth
          <div>Numboer of Players: {numPlayers}</div>
          <div>Recent Winner : {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle Address Deteched</div>
      )}
    </div>
  );
}
export default LotteryEntrance;
