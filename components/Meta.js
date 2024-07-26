import Head from "next/head"

export default function Meta({ title }) {
  return (
    <Head>
      <title>{title ? `${title}` : "Crypto Simulator"}</title>
      <meta name="description" content="Description of my website" />
    </Head>
  )
}
