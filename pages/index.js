import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  Container,
  Box,
  Heading,
  Text,
  ListItem,
  UnorderedList,
  Link,
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
      <main>
      <Container maxW="container.xl">
          <Box mb={8}>
            <Heading as='h1'mb={4}>Blockstories</Heading>
            <Text fontSize='xl'>
              The blockchain's footnote tool. Create  stories that appear as timelines annotating a series of transactions with your comments. Alternate stories from other writers are overlayed on top of yours.
            </Text>
            <Text fontSize='xl' mt={4}>
              Expose a hack, research a wallet or track the life of an NFT.
            </Text>
          </Box>
          <Heading as='h2' size='xl'>Recent &amp; Popular Stories</Heading>
          <UnorderedList className='unordered-list'>
            <ListItem className='unordered-list-item'>
              <Link href="#">
                The Most Traded Cryptopunk
              </Link>
            </ListItem>
            <ListItem className='unordered-list-item'>
              <Link href="#">
                Terra’s Last Minute Trades | 3 Stories
              </Link>
            </ListItem>
            <ListItem className='unordered-list-item'>
              <Link href="#">
                Joris’s NFT Journey
              </Link>
            </ListItem>
          </UnorderedList>
        </Container>
      </main>
      {/* <IPFSStorage nftData={nftData} /> */}
      <Footer />
    </div>
  );
}
