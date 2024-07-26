import "@/styles/globals.css"
import Layout from "@/components/layout"
import { PageContextProvider } from "@/utils/context"
export default function MyApp({ Component, pageProps }) {
  return (
    <PageContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PageContextProvider>
  )
}
