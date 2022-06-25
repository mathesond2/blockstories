import styles from '../styles/Home.module.css'
import Nav from '../components/nav';
import HeadMetadata from '../components/headMetadata';

export default function About() {
  return (
    <div className={styles.container}>
      <HeadMetadata/>
      <Nav/>

      <main className={styles.main}>
        <h1 className={styles.title}>About</h1>
      </main>
    </div>
  )
}