import Axios from "axios";
const C_KEY = process.env.COVALENT_API_KEY;

export default async function getTransaction(txHash) {
  const URL = `https://api.covalenthq.com/v1/1/transaction_v2/${txHash}/?key=${C_KEY}`;
  return await Axios.get(URL);
}
