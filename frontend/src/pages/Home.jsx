import { useEffect, useState } from "react";
import api from "../api/axios";
import HeroSlider from "../components/HeroSlider";
import "./Home.css";

function Home() {
    const [texts, setTexts] = useState([]);

    useEffect(() => {
        api.get("/sitetexts")
            .then((res) => {
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
            <HeroSlider />

            <div className="home">
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