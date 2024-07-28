import "@/styles/globals.css"
import Layout from "@/components/layout"
import { PageContextProvider } from "@/utils/context"
import Script from "next/script"
/**
 * Renders the main application component with the given props and wraps it in a PageContextProvider.
 *
 * @param {Object} props - The props passed to the component.
 * @param {React.ComponentType} props.Component - The component to render.
 * @param {Object} props.pageProps - The props to pass to the component.
 * @return {JSX.Element} The rendered component wrapped in a PageContextProvider.
 */
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
