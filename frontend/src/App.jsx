import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Members from "./pages/Members";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProjectDetail from "./pages/ProjectDetail";
import Apply from "./pages/Apply";
import Alumni from "./pages/Alumni";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hakkimizda" element={<About />} />
                <Route path="/projeler" element={<Events />} />
                <Route path="/projeler/:id" element={<ProjectDetail />} />
                <Route path="/iletisim" element={<Contact />} />
                <Route path="/basvuru" element={<Apply />} />
                <Route path="/uyeler" element={<Members />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mezunlar" element={<Alumni />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Footer />
        </>
    );
}

export default App;