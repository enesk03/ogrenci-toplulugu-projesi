import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css"; 

function Navbar() {
    const [siteTitle, setSiteTitle] = useState("Konya Teknik Topluluğu");
    const BASE_URL = "https://localhost:7060";


    const logoUrl = "/logo.png"; 

    useEffect(() => {
        axios.get(`${BASE_URL}/api/sitetexts`)
            .then((res) => {
                const dataList = res.data.data ? res.data.data : res.data;
                const titleObj = dataList.find(t => t.key === 'navbar.title');
                if (titleObj) setSiteTitle(titleObj.value);
            })
            .catch((err) => console.error("Navbar başlığı çekilemedi:", err));
    }, []);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={logoUrl} alt="KTÜN Logo" className="school-logo" />
                <span>{siteTitle}</span>
            </Link>

            <ul className="nav-menu">
                <li><Link to="/" className="nav-links">Ana Sayfa</Link></li>
                <li><Link to="/hakkimizda" className="nav-links">Hakkımızda</Link></li>
                <li><Link to="/etkinlikler" className="nav-links">Etkinlikler</Link></li>
                <li><Link to="/uyeler" className="nav-links">Üyeler</Link></li>
                <li><Link to="/basvuru" className="nav-links">Başvuru Yap</Link></li>
                <li><Link to="/iletisim" className="nav-links">İletişim</Link></li>
                <li><Link to="/admin" className="admin-btn-link">Yönetim</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;