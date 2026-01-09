import { useEffect, useState } from "react";
import axios from "axios";
import "./About.css";

function About() {
    const [texts, setTexts] = useState([]);
    const BASE_URL = "https://localhost:7060";

    useEffect(() => {
        //dbden  yazıları çek
        axios.get(`${BASE_URL}/api/sitetexts`)
            .then((res) => {
                setTexts(res.data.data ? res.data.data : res.data);
            })
            .catch((err) => console.error("Hakkımızda yazıları çekilemedi:", err));
    }, []);

    const getText = (key) => {
        const item = texts.find((t) => t.key === key);
        
        return item ? item.value : "Yükleniyor...";
    };

    return (
        <div className="about-page">

            <section className="about-hero">
                <h1>Hakkımızda</h1>
                <p>Hikayemiz, amaçlarımız ve geleceğe bakışımız.</p>
            </section>

            {/* İÇERİK ALANI */}
            <section className="about-content">

                <div className="about-card">
                    <h2>Biz Kimiz?</h2>
                    <p>{getText('about.who')}</p>
                </div>

                <div className="about-grid">
                    <div className="about-card">
                        <h3>Misyonumuz</h3>
                        <p>{getText('about.mission')}</p>
                    </div>

                    <div className="about-card">
                        <h3>Vizyonumuz</h3>
                        
                        <p>{getText('about.vision')}</p>
                    </div>
                </div>

            </section>
        </div>
    );
}

export default About;