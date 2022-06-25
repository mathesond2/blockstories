import styles from '../styles/Home.module.css'
import Nav from '../components/nav';
import HeadMetadata from '../components/headMetadata';
import {
  Container,
  Stack,
  Input,
  Button
 } from '@chakra-ui/react';
import { useState } from 'react';

/* {
  title: 'Home'
  comments: [
    {
    txId: '0x1234567890123456789012345678901234567890',
    timestamp: '',
    comment: 'This is a comment'
    },
    {
    hash: '0x1234567890123456789012345678901234567890'
    timestamp: '',
    comment: 'This is a comment'
    }
  ]
}
*/

export default function Create() {
  const [story, setStory] = useState({
    title: '',
    comments: []
  });

  return (
    <div className={styles.container}>
      <HeadMetadata/>
      <Nav/>

      <main>
      <Container maxW="container.xl">
        <Stack spacing={3}>
          <Input placeholder='Add a title' size='lg' onChange={(e) => setStory({title: e.currentTarget.value}) }/>
        </Stack>

        <Button variant='outline'>Add a transaction</Button>

        <div>{JSON.stringify(story)}</div>
        <div>
          <Button
            variant='outline'
            disabled={!(
              story.title.length &&
              story.comments?.length
            )}
          >
            Publish
          </Button>
        </div>
        </Container>
      </main>
    </div>
  )
}