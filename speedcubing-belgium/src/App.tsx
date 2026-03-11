import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Homepage";
import AboutPage from "./pages/AboutPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompetitionsPage from "./pages/CompetitionsPage";
import RecordsPage from "./pages/RecordsPage";
import DelegatesPage from "./pages/DelegatesPage";

export type Page = "home" | "about" | "competitions";

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sans antialiased">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/delegates" element={<DelegatesPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
