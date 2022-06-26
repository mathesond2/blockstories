import { NFTStorage, File } from "nft.storage"
import {Button} from '@chakra-ui/react'

const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY
const BS_API_ENDPOINT = 'http://localhost:4000'
console.log(BS_API_ENDPOINT)

async function processNftData(nftData) {

  const storage = new NFTStorage({token: NFT_STORAGE_API_KEY})
  let nftDataText = JSON.stringify(nftData)
  console.log(nftDataText)

  let file = new File([nftDataText], 'story.json', {type: "application/json"})
  const cid = await storage.storeDirectory([file])
  const final = await storage.status(cid)
  console.log({final})

  // Call Lens create post api
  //

  nftData.lensPubId = "dummy-lens-pub-id"
  const response = await fetch(BS_API_ENDPOINT + '/v1/stories/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: nftData
  })
  const storyId = response.id
  console.log({storyId})
  return storyId
}

const IPFSStorage = ({nftData}) => {

  return(<Button variant='outline' onClick={() => processNftData(nftData)}>Submit</Button>)
}

export default IPFSStorage;
