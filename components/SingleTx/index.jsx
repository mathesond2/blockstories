import { useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
import getTransaction from "../../pages/api/getTransaction";

export default function SingleTx({ txHash }) {
  const [transaction, setTransaction] = useState();

  const getTransactionData = async (tx) => {
    try {
      const response = await getTransaction(tx);
      setTransaction(response?.data?.data?.items[0]);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    if (txHash) {
      getTransactionData(txHash);
    }
  }, [txHash]);

  let humanizedCreatedAtTime;
  if (transaction?.block_signed_at) {
    humanizedCreatedAtTime = humanizeDuration(
      new Date().getTime() - Date.parse(transaction.block_signed_at),
      { largest: 1, maxDecimalPoints: 0 }
    );
  }

  return (
    <>
      <p>DATE: {transaction?.block_signed_at}</p>
      <p>DATA HUMANIZED: {humanizedCreatedAtTime} ago</p>
      <p>TX HASH: {transaction?.tx_hash}</p>
      <p>FROM: {transaction?.from_address}</p>
      <p>TO: {transaction?.to_address}</p>
    </>
  );
}
