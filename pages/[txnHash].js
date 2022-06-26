import styles from '../styles/Home.module.css'
import Nav from '../components/nav';
import HeadMetadata from '../components/headMetadata';
import {
  Container,
  Stack,
  Input,
  Box,
  Textarea,
 } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SingleTx from '../components/SingleTx';
import Axios from "axios";
import { useRouter } from 'next/router'

function StoryBlock(props) {
  const [txnHashData, setTxnHashData] = useState();
  const {txId, comment} = props.comment;
  const getTransactionData = async (txnHash) => {
    try {
      const URL = `https://api.covalenthq.com/v1/1/transaction_v2/${txnHash}/?key=${process.env.COVALENT_API_KEY}`;
      const response = await Axios.get(URL);
      console.log('response', response);
      setTxnHashData(response?.data?.data?.items[0]);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    getTransactionData(txId);
  }, [txId]);

  return (
    <Stack
      spacing={3}
      mt={8}
      mb={8}
      shadow='md'
      p={5}
    >
      {txnHashData && (
        <>
          <SingleTx txn={txnHashData} />
          <Textarea
            value={comment}
            className="textarea"
            placeholder='Tell us about this transaction'
            size='md'
            disabled
          />
        </>
      )}
    </Stack>
  )
}

export default function Story() {
  const [txnData, setTxnData] = useState();
  const router = useRouter()
  const { txnHash } = router.query;

  const getTransactionData = async (tx) => {
    try {
      const URL = `https://block-stories-api.herokuapp.com/v1/tx/${tx}/stories`;
      const response = await Axios.get(URL);
      setTxnData(response.data.results[0]);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    if (txnHash) getTransactionData(txnHash);
  }, [txnHash]);


  return (
    txnData && (
      <div className={styles.container}>
        <HeadMetadata/>
        <Nav/>
        <main>
          <Container maxW="container.xl">
            <Stack spacing={3} mb={4}>
              <Input
                variant='unstyled'
                placeholder='Add story title'
                value={txnData.title}
                size='lg'
                className="story-title"
                disabled
              />
            </Stack>
            <Box className="storyblocks-wrapper">
              {txnData.comments?.map((comment, i) => (<StoryBlock key={i} comment={comment}/>))}
            </Box>
          </Container>
        </main>
      </div>
    )
  )
}