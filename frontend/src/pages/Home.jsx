import { useEffect, useState } from "react";
import axios from "axios";
import HeroSlider from "../components/HeroSlider"; // 🔥 UNUTMA: Bunu import etmelisin!
import "./Home.css";

function Home() {
    const [texts, setTexts] = useState([]);
    // Eğer backend farklı porttaysa burayı güncelle
    const BASE_URL = "https://localhost:7060";

    useEffect(() => {
        axios.get(`${BASE_URL}/api/sitetexts`)
            .then((res) => {
                // Backend yapına göre res.data veya res.data.data olabilir, kontrol et
                setTexts(res.data.data ? res.data.data : res.data);
            })
            .catch((err) => console.error("Site yazıları çekilemedi:", err));
    }, []);

    const getText = (key) => {
        if (!texts) return "...";
        const item = texts.find((t) => t.key === key);
        return item ? item.value : "...";
    };

    return (
        <div className="main-wrapper">
            {/* 1. SLIDER EN ÜSTTE (Sayfa genişliğinin %80'i) */}
            <HeroSlider />

            {/* 2. DİĞER İÇERİKLER */}
            <div className="home">

                {/* Eski Hero (Yazı Başlığı) - Slider olduğu için burayı biraz sadeleştirebilirsin */}
                <section className="hero">
                    <h1>{getText('home.hero.title')}</h1>
                    <p>{getText('home.hero.subtitle')}</p>
                </section>

                <section className="manifesto">
                    <h2>Biz Ne Yapıyoruz?</h2>
                    <p>{getText('home.manifesto.text')}</p>
                </section>

                <section className="stats">
                    <div className="stat">
                        <h3>{getText('home.stats.1')}</h3>
                        <span>Gönüllü Katılım</span>
                    </div>

                    <div className="stat">
                        <h3>{getText('home.stats.2')}</h3>
                        <span>Etkileşim</span>
                    </div>

                    <div className="stat">
                        <h3>{getText('home.stats.3')}</h3>
                        <span>Fikir</span>
                    </div>
                </section>

                <section className="quote">
                    <p>“{getText('home.quote')}”</p>
                </section>

            </div>
        </div>
    );
}

export default Home;