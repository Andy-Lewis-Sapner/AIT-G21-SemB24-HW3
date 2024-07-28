import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-slate-800">
        {children}
      </main>
      <Footer />
    </div>
  )
}
