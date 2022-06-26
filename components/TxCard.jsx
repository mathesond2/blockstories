import { Link } from '@chakra-ui/react'
import humanizeDuration from "humanize-duration";

export default function SingleTx({ txn }) {
  const humanizedCreatedAtTime = humanizeDuration(
    new Date().getTime() - Date.parse(txn.block_signed_at),
    { largest: 1, maxDecimalPoints: 0 }
  );

    return (
    <>
      <div className='single-tx-flex-wrapper'>
      <Link href={`https://etherscan.io/tx/${txn.txId}`} color='blue.500' isExternal>
        {txn.txId }
      </Link >
      <p><strong>{humanizedCreatedAtTime} ago</strong></p>
      </div>
      <ul>
        <li className='list-item'><strong>from</strong> {txn?.from_address}</li>
        <li className='list-item'><strong>to</strong> {txn?.to_address}</li>
        <li className='list-item'><strong>gas price</strong> {txn?.gas_price}</li>
      </ul>
    </>
  );
}
