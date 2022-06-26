import { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ChakraProvider, Container, Input, Button } from "@chakra-ui/react";
import "../styles/globals.css";
import { ethers, providers } from "ethers";
import {
  createClient,
  STORAGE_KEY,
  authenticate as authenticateMutation,
  getChallenge,
} from "../api";
import { parseJwt, refreshAuthToken } from "../utils";
import Profile from "../components/Profile";

function MyApp({ Component, pageProps }) {
  const [connected, setConnected] = useState(true);
  const [userAddress, setUserAddress] = useState();
  const router = useRouter();

  const AppContext = createContext();

  useEffect(() => {
    refreshAuthToken();
    async function checkConnection() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const addresses = await provider.listAccounts();
      if (addresses.length) {
        setConnected(true);
        setUserAddress(addresses[0]);
      } else {
        setConnected(false);
      }
    }
    checkConnection();
    listenForRouteChangeEvents();
  }, []);

  async function listenForRouteChangeEvents() {
    router.events.on("routeChangeStart", () => {
      refreshAuthToken();
    });
  }

  async function signIn() {
    try {
      const accounts = await window.ethereum.send("eth_requestAccounts");
      setConnected(true);
      const account = accounts.result[0];
      setUserAddress(account);
      const urqlClient = await createClient();
      const response = await urqlClient
        .query(getChallenge, {
          address: account,
        })
        .toPromise();
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(response.data.challenge.text);
      const authData = await urqlClient
        .mutation(authenticateMutation, {
          address: account,
          signature,
        })
        .toPromise();
      const { accessToken, refreshToken } = authData.data.authenticate;
      const accessTokenData = parseJwt(accessToken);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken,
          refreshToken,
          exp: accessTokenData.exp,
        })
      );
    } catch (err) {
      console.log("error: ", err);
    }
  }

  return (
    <AppContext.Provider
      value={{
        userAddress,
      }}
    >
      <ChakraProvider>
        <Container maxW="container.xl" className="top-nav">
          <nav>
            <ul className="link-list">
              <li className="link-list__item">
                <Link href="/">BlockStories</Link>
              </li>
              <li className="link-list__item">
                <Input placeholder="search..." />
              </li>
              <li className="link-list__item">
                <Link href="/explore">Explore</Link>
              </li>
              <li className="link-list__item">
                <Link href="/create">Create</Link>
              </li>
            </ul>
          </nav>
          {!connected || !userAddress ? (
            <Button variant="outline" onClick={signIn}>
              Sign in
            </Button>
          ) : (
            <p>You are logged-in!</p>
          )}
        </Container>
        <Component {...pageProps} />
      </ChakraProvider>
    </AppContext.Provider>
  );
}

export default MyApp;

/**<Profile userAddress={userAddress} /> */
