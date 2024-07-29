import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow bg-gray-100 dark:bg-gray-900">{children}</main>
      <Footer />
    </div>
  )
}
