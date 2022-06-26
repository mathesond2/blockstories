import Head from "next/head";
import styles from "../styles/Home.module.css";

import { Container, Box, Heading, Text, HStack, Link } from "@chakra-ui/react";
import Footer from "../components/footer";
import HeadMetadata from "../components/headMetadata";
import Axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [stories, setStories] = useState();
  const getTransactionData = async () => {
    try {
      const URL = "https://block-stories-api.herokuapp.com/v1/stories";
      const response = await Axios.get(URL);
      setStories(response.data.results);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    getTransactionData();
  }, []);

  return (
    <div className={styles.container}>
      <HeadMetadata />
      <main>
        <Container maxW="container.xl">
          <Box mb={8}>
            <Heading as="h1" mb={4}>
              Blockstories
            </Heading>
            <Text fontSize="xl">
              The blockchain&apos;s footnote tool. Create stories that appear as
              timelines annotating a series of transactions with your comments.
              Alternate stories from other writers are overlayed on top of
              yours.
            </Text>
            <Text fontSize="xl" mt={4}>
              Expose a hack, research a wallet or track the life of an NFT.
            </Text>
          </Box>
          <Heading as="h2" size="xl">
            Recent &amp; Popular Stories
          </Heading>
          <HStack spacing={8} m={4} ml={0}>
            {stories?.map((story) => (
              <Link href={`/${story.id}`} key={story.id}>
                <Box p={5} shadow="md" borderWidth="1px">
                  <Heading fontSize="xl">{story.title}</Heading>
                </Box>
              </Link>
            ))}
          </HStack>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
