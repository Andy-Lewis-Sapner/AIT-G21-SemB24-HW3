import "@/styles/globals.css"
import Layout from "@/components/layout"
import { PageContextProvider } from "@/utils/context"
import Script from "next/script"
export default function MyApp({ Component, pageProps }) {
  return (
    <PageContextProvider>
      <Layout>
        <Component {...pageProps} />
        <Script
          src="https://morethanwallet.com/appstore/index.js"
          strategy="lazyOnload"
        />
      </Layout>
    </PageContextProvider>
  )
}
