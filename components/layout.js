import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="grow bg-gray-100 dark:bg-gray-800">{children}</main>
      <Footer />
    </div>
  )
}
