import Head from "next/head"

export default function Meta({ title }) {
  return (
    <Head>
      <title>{title ? `${title}` : "Crypto Simulator"}</title>
      <meta name="description" content="A crypto trading simulator" />
    </Head>
  )
}
