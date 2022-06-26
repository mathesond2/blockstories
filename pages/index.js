import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Container } from "@chakra-ui/react";
import Footer from "../components/footer";
import HeadMetadata from "../components/headMetadata";

export default function Home() {
  return (
    <div className={styles.container}>
      <HeadMetadata />
      <main className={styles.main}>
        <Container maxW="container.xl">
          <h1>content here</h1>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
