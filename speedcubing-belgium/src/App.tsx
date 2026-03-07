import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Homepage";
import AboutPage from "./pages/AboutPage";

export type Page = "home" | "about";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="font-sans antialiased">
      <Navbar currentPage={page} onNavigate={setPage} />
      {page === "home"  && <HomePage />}
      {page === "about" && <AboutPage />}
      <Footer />
    </div>
  );
}