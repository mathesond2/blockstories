import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  Container,
} from "@chakra-ui/react";
import Footer from "../components/footer";
import IPFSStorage from "../components/nftStorage";
import HeadMetadata from "../components/headMetadata";

const nftData = {
  title: "test story",
  comments: [
    {
      txId: "0x570dca959e1c9033b4ef216998dae086339a474d983caaed3d7a9736c11e5936",
      timestamp: 1656196311,
      comment: "Someone made his first interaction with a liquidity pool",
    },
    {
      txId: "0x52b4ff8ffec10dbb2aa43fb2b8194733acb1eb222f85f4d5d95d7aab218ff7b6",
      timestamp: 1656198603,
      comment: "Someone else transfered some funds",
    },
  ],
};

export default function Home() {
  return (
    <div className={styles.container}>
      <HeadMetadata />
      <main className={styles.main}>
        <Container maxW="container.xl">
          <h1>content here</h1>
        </Container>
      </main>
      <IPFSStorage nftData={nftData} />
      <Footer />
    </div>
  );
}
