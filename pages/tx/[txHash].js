import styles from "../../styles/Home.module.css";
import HeadMetadata from "../../components/headMetadata";
import { Container, Stack, Input, Box, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SingleTx from "../../components/SingleTx";
import Axios from "axios";
import { useRouter } from "next/router";

export default function Transaction() {
  const [txnData, setTxnData] = useState();
  const router = useRouter();
  const { txHash } = router.query;

  const getTransactionData = async (tx) => {
    try {
      console.log("Should be called");
      const URL = `https://block-stories-api.herokuapp.com/v1/tx/${tx}/stories`;
      const response = await Axios.get(URL);
      setTxnData(response.data.results);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    if (txHash) {
      console.log("hi");
      getTransactionData(txHash);
    }
  }, [txHash]);

  return (
    txnData && (
      <div className={styles.container}>
        <HeadMetadata />
        <main>
          <Container maxW="container.xl">
            <Stack spacing={3} mb={4}>
              <Input
                variant="unstyled"
                placeholder="Add story title"
                value={`Stories about tx: ${txHash.substring(0, 7)}...`}
                size="sm"
                className="story-title"
                disabled
              />
            </Stack>
            <Box className="storyblocks-wrapper">
              <ul style={{ listStyleType: "none" }}>
                {txnData.map((txn, i) => (
                  <Stack spacing={3} mt={8} mb={8} shadow="md" p={5}>
                    <li style={{ listStyleType: "none" }}>
                      <Text style={{ fontWeight: "bold" }}>
                        <Link href={`/${txn.id}`}>{txn.title}</Link>
                      </Text>
                    </li>
                  </Stack>
                ))}
              </ul>
            </Box>
          </Container>
        </main>
      </div>
    )
  );
}
