import Head from 'next/head'

export default function HeadMetadata() {
  return (
    <Head>
      <title>BlockStories</title>
      <meta name="description" content="a better way to talk about events that happen on-chain" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}