import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header component at the top of the layout */}
      <Header />

      {/* Main content area where child components will be rendered */}
      <main className="grow bg-gray-100 dark:bg-gray-900">{children}</main>

      {/* Footer component at the bottom of the layout */}
      <Footer />
    </div>
  )
}
