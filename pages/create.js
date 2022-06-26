import styles from '../styles/Home.module.css'
import Nav from '../components/nav';
import HeadMetadata from '../components/headMetadata';
import {
  Container,
  Stack,
  Input,
  Button,
  Box,
  Textarea,
  Circle
 } from '@chakra-ui/react';
 import { CheckIcon, DeleteIcon } from '@chakra-ui/icons'
import { useState } from 'react';
import SingleTx from '../components/SingleTx';
import Axios from "axios";

function StoryBlock(props) {
  const {onRemove, onAdd, isPublished} = props;
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
            variant='unstyled'
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
            className="textarea"
            onChange={(e) => setTxnHashComment(e.currentTarget.value)}
            placeholder='Tell us about this transaction'
            size='md'
            disabled={isPublished}
          />
        </>
      )}

        {!isPublished && (
          <Stack direction='row' spacing={4}>
            <Button variant='ghost' onClick={onRemove}>
              <DeleteIcon/>
            </Button>
            {isAdded ?
              <Circle size='40px' bg='#00501e' color='white'>
                <CheckIcon />
              </Circle> :
              <Button
                variant='ghost'
                onClick={() => {
                    setIsAdded(true);
                    onAdd({
                      txId: txnHash,
                      timestamp: Date.parse(txnHashData.block_signed_at) / 1000,
                      comment: txnHashComment
                  })}
                }
                disabled={isAdded || !txnHashData}
              >
              add to story
            </Button>
            }
          </Stack>
        )}
    </Stack>
  )
}

export default function Create() {
  const [storyComments, setStoryComments] = useState([]);
  const [title, setTitle] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  return (
    <div className={styles.container}>
      <HeadMetadata/>
      <Nav/>

      <main>
      <Container maxW="container.xl">
        <Stack spacing={3} mb={4}>
          <Input
            variant='unstyled'
            placeholder='Add story title'
            size='lg'
            onChange={(e) => setTitle(e.currentTarget.value) }
            className="story-title"
          />
        </Stack>

        <Box className="storyblocks-wrapper">
          {storyComments?.map((_, i) => (
            <StoryBlock
              key={i}
              isPublished={isPublished}
              onRemove={() => {
                const filteredComments = storyComments.filter((_, j) => j !== i);
                setStoryComments(filteredComments)
              }}
              onAdd={(newComment) => {
                setStoryComments((prevState) => {
                  const newArr = [...prevState];
                  newArr[i] = newComment;
                  return newArr;
                });
              }}
            />
          ))}
        </Box>

        {
          !isPublished && (
            <Box className="actions-container" mb={12}>
              <Button
                variant='outline'
                disabled={!title.length}
                onClick={() => {
                  setStoryComments((prevState) => [...prevState, {}])
                }}
              >
                Add {storyComments.length ? 'another' : 'a'} transaction
              </Button>

              {storyComments.length > 0 &&
              storyComments.length > 0 && (
                <Button
                  className='submit-button'
                  variant='solid'
                  disabled={!(
                  title.length &&
                  storyComments?.length
                  )}
                  onClick={() => {
                    setIsPublished(true);
                  }}
                >
                  Publish
                </Button>
              )}
          </Box>
          )
        }
        </Container>
      </main>
    </div>
  )
}