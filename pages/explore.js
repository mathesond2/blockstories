import styles from '../styles/Home.module.css'
import HeadMetadata from '../components/headMetadata';
import { Container } from '@chakra-ui/react';

export default function Explore() {
  return (
    <div className={styles.container}>
      <HeadMetadata/>

      <main className={styles.main}>
        <Container maxW="container.xl">
          <h1 className={styles.title}>explore</h1>
        </Container>
      </main>
    </div>
  )
}