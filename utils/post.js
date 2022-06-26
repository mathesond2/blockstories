import { useRouter } from "next/router";
import { useState, useEffect, useContext, createContext } from "react";
import {
  createClient,
  getPublications,
  getProfiles,
  doesFollow as doesFollowQuery,
  createUnfollowTypedData,
  createPostTypedData,
} from "../api";
import { ethers } from "ethers";
import { css } from "@emotion/css";
export const AppContext = createContext();
import {
  getSigner,
  generateRandomColor,
  splitSignature,
  signedTypeData,
} from "../../utils";

import ABI from "../../abi";
const LENS_HUB_CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export default function Profile() {
  const [profile, setProfile] = useState();
  const [publications, setPublications] = useState([]);
  const [doesFollow, setDoesFollow] = useState();
  const [loadedState, setLoadedState] = useState("");
  const router = useRouter();
  const context = useContext(AppContext);
  const { id } = router.query;
  const { userAddress } = context;

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
    if (id && userAddress) {
      checkDoesFollow();
    }
  }, [id, userAddress]);

  async function unfollow() {
    try {
      const client = await createClient();
      const response = await client
        .mutation(createUnfollowTypedData, {
          request: { profile: id },
        })
        .toPromise();
      const typedData = response.data.createUnfollowTypedData.typedData;
      const contract = new ethers.Contract(
        typedData.domain.verifyingContract,
        ABI,
        getSigner()
      );

      const tx = await contract.burn(typedData.value.tokenId);
      setTimeout(() => {
        setDoesFollow(false);
      }, 2500);
      await tx.wait();
      console.log(`successfully unfollowed ... ${profile.handle}`);
    } catch (err) {
      console.log("error:", err);
    }
  }

  // HARDCODE
  const profileId = "0x7cdc";
  const ipfsResult = {
    path: "QmTkhwwKqEx9Wv1ujqeoUbhW1Hij1xt8fNKuw8fcCVdJQh",
  };

  async function post() {
    console.log("POST START");
    try {
      const client = await createClient();
      const response = await client
        .mutation(createPostTypedData, {
          request: {
            profileId,
            contentURI: "ipfs://QmTkhwwKqEx9Wv1ujqeoUbhW1Hij1xt8fNKuw8fcCVdJQh",
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
        setDoesFollow(false);
      }, 2500);
      await tx.wait();
      console.log(`successfully unfollowed ... ${profile.handle}`);
    } catch (err) {
      console.log("error:", err);
    }
  }

  async function fetchProfile() {
    try {
      const urqlClient = await createClient();
      const returnedProfile = await urqlClient
        .query(getProfiles, { id })
        .toPromise();
      const profileData = returnedProfile.data.profiles.items[0];
      profileData.color = generateRandomColor();
      setProfile(profileData);

      const pubs = await urqlClient
        .query(getPublications, { id, limit: 50 })
        .toPromise();

      setPublications(pubs.data.publications.items);
      setLoadedState("loaded");
    } catch (err) {
      console.log("error fetching profile...", err);
    }
  }

  async function checkDoesFollow() {
    const urqlClient = await createClient();
    const response = await urqlClient
      .query(doesFollowQuery, {
        request: {
          followInfos: [
            {
              followerAddress: userAddress,
              profileId: id,
            },
          ],
        },
      })
      .toPromise();
    setDoesFollow(response.data.doesFollow[0].follows);
  }

  async function followUser() {
    const contract = new ethers.Contract(
      LENS_HUB_CONTRACT_ADDRESS,
      ABI,
      getSigner()
    );

    try {
      const tx = await contract.follow([id], [0x0]);
      setTimeout(() => {
        setDoesFollow(true);
      }, 2500);
      await tx.wait();
      console.log(`successfully followed ... ${profile.handle}`);
    } catch (err) {
      console.log("error: ", err);
    }
  }

  if (!profile) return null;

  return (
    <div className={containerStyle}>
      <button className={buttonStyle} onClick={post}>
        POST
      </button>
      <div
        className={css`
          ${headerStyle};
          background-image: url(${profile.coverPicture?.original.url});
          background-color: ${profile.color};
        `}
      ></div>
      <div className={columnWrapperStyle}>
        <div>
          <img
            className={css`
              ${profileImageStyle};
              background-color: profile.color;
            `}
            src={profile.picture?.original?.url}
          />
          <h3 className={nameStyle}>{profile.name}</h3>
          <p className={handleStyle}>{profile.handle}</p>
          <div>
            {userAddress ? (
              doesFollow ? (
                <button onClick={unfollow} className={buttonStyle}>
                  Unfollow
                </button>
              ) : (
                <button onClick={followUser} className={buttonStyle}>
                  Follow
                </button>
              )
            ) : null}
          </div>
        </div>
        <div className={rightColumnStyle}>
          <h3 className={postHeaderStyle}>Posts</h3>
          {publications.map((pub, index) => (
            <div className={publicationWrapper} key={index}>
              <p className={publicationContentStyle}>{pub.metadata.content}</p>
            </div>
          ))}
          {loadedState === "loaded" && !publications.length && (
            <div className={emptyPostContainerStyle}>
              <p className={emptyPostTextStyle}>
                <span className={emptyPostHandleStyle}>{profile.handle}</span>{" "}
                has not posted yet!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
