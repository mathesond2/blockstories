import styles from '../styles/Home.module.css'
import Nav from '../components/nav';
import HeadMetadata from '../components/headMetadata';
import { Container } from '@chakra-ui/react';

export default function MyStories() {
  return (
    <div className={styles.container}>
      <HeadMetadata/>
      <Nav/>

      <main className={styles.main}>
      <Container maxW="container.xl">
          <h1 className={styles.title}>My Stories</h1>
        </Container>
      </main>
    </div>
  )
}