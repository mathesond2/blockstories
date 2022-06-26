import styles from '../styles/Home.module.css'
import Nav from '../components/nav';
import HeadMetadata from '../components/headMetadata';
import {
  Container,
  Stack,
  Input,
  Button,
  Box,
  Textarea
 } from '@chakra-ui/react';
import { useState } from 'react';
import SingleTx from '../components/SingleTx';
import Axios from "axios";

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

function StoryBlock(props) {
  const {onRemove, onAdd} = props;
  const [txnHash, setTxnHash] = useState();
  const [txnHashData, setTxnHashData] = useState();
  const [txnHashComment, setTxnHashComment] = useState();
  const [isAdded, setIsAdded] = useState(false);

  const getTransactionData = async (tx) => {
    try {
      const URL = `https://api.covalenthq.com/v1/1/transaction_v2/${txnHash}/?key=${process.env.COVALENT_API_KEY}`;
      const response = await Axios.get(URL);
      setTxnHashData(response?.data?.data?.items[0]);
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <Stack
      spacing={3}
      mt={8}
      mb={8}
      shadow='md'
      p={5}
    >
      {!txnHashData && (
        <>
          <Input
            placeholder='Add transaction hash'
            size='lg'
            onChange={(e) => setTxnHash(e.currentTarget.value)}
            disabled={txnHashData}
          />
          <Button
            variant='outline'
            disabled={!txnHash}
            onClick={getTransactionData}
          >get transaction data</Button>
        </>
      )}

      {txnHashData && (
        <>
          <SingleTx txn={txnHashData} />
          <Textarea
            value={txnHashComment}
            onChange={(e) => setTxnHashComment(e.currentTarget.value)}
            placeholder='Tell us about this transaction'
            size='md'
          />
        </>
      )}

      <Stack direction='row' spacing={4}>
        <Button variant='outline' onClick={onRemove}>
          remove
        </Button>
        {isAdded ?
          <p>Added</p> :
          <Button
            variant='outline'
            onClick={() => {
                setIsAdded(true);
                onAdd({
                  txId: txnHash,
                  timestamp: txnHashData.block_signed_at,
                  comment: txnHashComment
              })}
            }
            disabled={isAdded || !txnHashData}
          >
          add to story
        </Button>
        }
      </Stack>
    </Stack>
  )
}




export default function Create() {
  const [storyComments, setStoryComments] = useState([]);
  const [title, setTitle] = useState('');

  return (
    <div className={styles.container}>
      <HeadMetadata/>
      <Nav/>

      <main>
      <Container maxW="container.xl">
        <Stack spacing={3} mb={4}>
          <Input placeholder='Add story title' size='lg' onChange={(e) => setTitle(e.currentTarget.value) }/>
        </Stack>

        <Box className="storyblocks-wrapper">
          {storyComments?.map((_, i) => (
            <StoryBlock
              key={i}
              onRemove={() => {
                const filteredComments = storyComments.filter((_, j) => j !== i);
                setStoryComments(filteredComments)
              }}
              onAdd={(newComment) => {
                console.log(newComment);
                const commentToUpdate = storyComments
                  .find((_, j) => j === i)
                  .comment = newComment;
                const updatedStoryComments = storyComments;
                updatedStoryComments[i] = commentToUpdate;

                setStoryComments(updatedStoryComments)
              }}
            />
          ))}
        </Box>

        <div>
          <Button
            variant='outline'
            disabled={!title.length}
            onClick={() => {
              setStoryComments([...storyComments, {}])
            }}
          >
            Add {storyComments.length ? 'another' : 'a'} transaction
          </Button>

          {storyComments.length > 0 &&
          storyComments.length > 0 && (
            <Button
              variant='outline'
              disabled={!(
              title.length &&
              storyComments?.length
              )}
            >
              Publish
            </Button>
          )}

        </div>
        </Container>
      </main>
    </div>
  )
}