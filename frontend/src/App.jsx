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
import ProjectDetail from "./pages/ProjectDetail";
import Apply from "./pages/Apply";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/hakkimizda" element={<About />} />

                <Route path="/etkinlikler" element={<Events />} />
                <Route path="/etkinlikler/:id" element={<EventDetail />} />

                <Route path="/gallery" element={<Gallery />} />

                <Route path="/iletisim" element={<Contact />} />

                <Route path="/basvuru" element={<Apply />} />

                <Route path="/uyeler" element={<Members />} />

                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/projeler/:id" element={<ProjectDetail />} />

            </Routes>

            <Footer />
        </>
    );
}

export default App;