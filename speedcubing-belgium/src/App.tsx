import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Homepage";
import AboutPage from "./pages/AboutPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export type Page = "home" | "about";

export default function App() {

  return (
    <BrowserRouter>
      <div className="font-sans antialiased">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}