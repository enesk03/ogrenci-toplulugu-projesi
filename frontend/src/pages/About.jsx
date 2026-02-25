import { useEffect, useState } from "react";
import axios from "axios";
import "./About.css"; // CSS dosyasını çağırdık

function About() {
    const [texts, setTexts] = useState({});
    const BASE_URL = "https://localhost:7060";

    useEffect(() => {
        axios.get(`${BASE_URL}/api/sitetexts`)
            .then((res) => {
                const textObj = {};
                // API'den gelen veriyi işle
                const dataList = res.data.data ? res.data.data : res.data;

                if (Array.isArray(dataList)) {
                    dataList.forEach(item => {
                        textObj[item.key] = item.value;
                    });
                    setTexts(textObj);
                }
            })
            .catch((err) => console.error("Hakkımızda verisi çekilemedi", err));
    }, []);

    return (
        <div className="about-page">
            <div className="about-container">

                {/* ÜST BAŞLIK */}
                <div className="about-header">
                    <h1 className="about-title">Hakkımızda</h1>
                    <div className="title-underline"></div>
                </div>

                {/* BİZ KİMİZ KUTUSU */}
                <div className="about-main-content">
                    <h2>Biz Kimiz?</h2>
                    <p className="about-text">
                        {texts['about.who'] || "Yükleniyor..."}
                    </p>
                </div>

                {/* MİSYON & VİZYON KARTLARI */}
                <div className="mission-vision-grid">

                    {/* Misyon Kartı */}
                    <div className="mv-card">
                        <h3>MİSYON</h3>
                        <p>
                            {texts['about.mission'] || "Öğrencilerin gelişimine katkı sağlamak..."}
                        </p>
                    </div>

                    {/* Vizyon Kartı */}
                    <div className="mv-card">
                        <h3>VİZYON</h3>
                        <p>
                            {texts['about.vision'] || "Geleceğin teknolojilerine yön vermek..."}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default About;