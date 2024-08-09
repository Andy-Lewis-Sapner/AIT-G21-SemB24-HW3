import Head from "next/head"

export default function Meta({ title }) {
  return (
    <Head>
      {/* Sets the title of the page, with a fallback to "Crypto Simulator" */}
      <title>{title ? `${title}` : "Crypto Simulator"}</title>

      {/* Meta description for SEO and providing information about the page */}
      <meta name="description" content="A crypto trading simulator" />
    </Head>
  )
}
