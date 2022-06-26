import Axios from "axios";

export default async function getTransaction(txHash) {
  const URL = `https://api.covalenthq.com/v1/1/transaction_v2/${txHash}/?key=${process.env.COVALENT_API_KEY}`;
  return await Axios.get(URL);
}
