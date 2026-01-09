import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Members from "./pages/Members";
import Login from "./pages/Login";
import Admin from "./pages/Admin"; 

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />

                {/* 👇 Navbar linkleriyle eşleşmesi için buraları Türkçe yapıyoruz */}
                <Route path="/hakkimizda" element={<About />} />  {/* Eskisi: /about */}

                <Route path="/etkinlikler" element={<Events />} />
                <Route path="/etkinlikler/:id" element={<EventDetail />} />

                <Route path="/gallery" element={<Gallery />} />

                <Route path="/iletisim" element={<Contact />} />  {/* Eskisi: /contact */}

                <Route path="/uyeler" element={<Members />} />    {/* Eskisi: /members */}
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;