import { useEffect, useState } from "react";
import { apolloClient } from "../utils/apollo-client";
import { gql } from "@apollo/client";

const GET_DEFAULT_PROFILES = `
  query($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
         type
        }
        ... on RevertFollowModuleSettings {
         type
        }
      }
    }
  }
`;

const Profile = ({ userAddress }) => {
  const [profile, setProfile] = useState(null);

  const getProfile = () => {
    const profileData = apolloClient.query({
      query: gql(GET_DEFAULT_PROFILES),
      variables: {
        request: {
          userAddress,
        },
      },
    });
    console.log({ profileData });
    // setProfile(profileData)
  };

  useEffect(() => {
    const profile = getProfile();
    console.log({ profile });
  }, []);

  return null;
  // return <>{profileData}</>
};

export default Profile;
