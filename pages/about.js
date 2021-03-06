import styles from '../styles/Home.module.css'
import HeadMetadata from '../components/headMetadata';
import { Container } from '@chakra-ui/react';

export default function About() {
  return (
    <div className={styles.container}>
      <HeadMetadata/>
      <main>
        <Container maxW="container.xl">
          <h1 className={styles.title}>About</h1>
        </Container>
      </main>
    </div>
  )
}