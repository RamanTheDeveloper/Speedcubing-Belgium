import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Homepage";

export default function App() {
  return (
    <div className="font-sans antialiased">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  );
}