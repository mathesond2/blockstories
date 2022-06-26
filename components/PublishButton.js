import { useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { Button, Spinner } from "@chakra-ui/react";
import { ethers } from "ethers";

import { createClient, createPostTypedData, getPublication } from "../api";
import { getSigner, splitSignature, signedTypeData } from "../utils";
import ABI from "../abi/abi.json";

const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;
const BS_API_ENDPOINT = process.env.BS_API_ENDPOINT;
// const BS_API_ENDPOINT = 'http://localhost:3000'

export const editNFTDATA = (storyBody) => {
  storyBody.content = storyBody.comments
    .map((comment) => `${comment.txId}\n${comment.comment}\n`)
    .join("\n");
  storyBody.description = storyBody.comments
    .map((comment) => `${comment.txId}\n${comment.comment}\n`)
    .join("\n");
  storyBody.appId = "BlockStories";

  return storyBody;
};

const PublishButton = ({ nftData, isDisabled }) => {
  const updatedNFTDATA = editNFTDATA(nftData);

  const [txHash, setTxHash] = useState(
    "0xfd716e84f3af0d9ea0edd52c1598c755f9e767b74e28c73474807335096dad81"
  );
  const [isLoading, setIsLoading] = useState(false);

  /**
  async function fetchPublication() {
    try {
      const urqlClient = await createClient();

      const pub = await urqlClient
        .query(getPublication, { txHash })
        .toPromise();
      console.log({ pub });
    } catch (err) {
      console.log("error fetching publication...", err);
    }
  }
   */

  async function post(URI, profileId) {
    console.log("POST START");
    console.log(`ipfs://${URI}/story.json`);
    try {
      const client = await createClient();
      const response = await client
        .mutation(createPostTypedData, {
          request: {
            profileId,
            contentURI: `ipfs://${URI}/story.json`,
            collectModule: {
              freeCollectModule: { followerOnly: true },
            },
            referenceModule: {
              followerOnlyReferenceModule: false,
            },
          },
        })
        .toPromise();
      console.log({ response });

      const typedData = response.data.createPostTypedData.typedData;
      const contract = new ethers.Contract(
        typedData.domain.verifyingContract,
        ABI,
        getSigner()
      );

      console.log("create post: typedData", typedData);
      const signature = await signedTypeData(
        typedData.domain,
        typedData.types,
        typedData.value
      );

      console.log("create post: signature", signature);
      const { v, r, s } = splitSignature(signature);
      // postWithSig?
      const tx = await contract.post({
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      return await tx.wait();
    } catch (err) {
      console.log("error:", err);
      setIsLoading(false);
    }
  }

  async function processNftData(nftData) {
    setIsLoading(true);

    console.log({NFT_STORAGE_API_KEY});
    let apiKey = process.env.NFT_STORAGE_API_KEY;
    console.log({apiKey});
    
    const storage = new NFTStorage({ token: NFT_STORAGE_API_KEY });
    let nftDataText = JSON.stringify(nftData);
    console.log(nftDataText);

    let file = new File([nftDataText], "story.json", {
      type: "application/json",
    });
    const cid = await storage.storeDirectory([file]);
    const final = await storage.status(cid);

    // Call Lens create post api
    console.log({ final });

    // NOTE HARDCODE profileId
    const profileId = "0x7cdc";
    // const ipfsResult = {
    // path: "QmTkhwwKqEx9Wv1ujqeoUbhW1Hij1xt8fNKuw8fcCVdJQh",
    // };
    const ipfsResult = {
      path: final.cid,
    };

    // fetchPublication();

    const sendPostToLens = await post(ipfsResult.path, profileId);
    console.log(`successfully posted ...`);
    console.log({ sendPostToLens });
    // sendPostToLens.blockHash

    nftData.lensPubId = "duy-443ddsdd2";
    console.log(nftData);
    const response = await fetch(BS_API_ENDPOINT + "/v1/stories/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(nftData),
    });
    const json = await response.json();
    const storyId = json.id;
    console.log({ storyId });
    return storyId;
  }

  console.log({ isLoading });

  return (
    <>
      <Button
        leftIcon={isLoading && <Spinner />}
        className="submit-button"
        disabled={isDisabled || isLoading}
        variant="solid"
        onClick={() => processNftData(updatedNFTDATA)}
      >
        Publish
      </Button>
    </>
  );
};

export default PublishButton;
