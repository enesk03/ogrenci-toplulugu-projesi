import { useEffect, useState } from "react";
import "./About.css";
import api from "../api/axios";

function About() {
    const [texts, setTexts] = useState({});

    useEffect(() => {
        api.get("/sitetexts")
            .then((res) => {
                const textObj = {};
                const dataList = res.data.data ? res.data.data : res.data;
                if (Array.isArray(dataList)) {
                    dataList.forEach(item => { textObj[item.key] = item.value; });
                    setTexts(textObj);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="about-page">
            <div className="about-container">
                <div className="about-header">
                    <h1 className="about-title">Hakkımızda</h1>
                    <div className="title-underline"></div>
                </div>
                <div className="about-main-content">
                    <h2>Biz Kimiz?</h2>
                    <p className="about-text">
                        {texts['about.who'] || "Yükleniyor..."}
                    </p>
                </div>
                <div className="mission-vision-grid">
                    <div className="mv-card">
                        <h3>MİSYON</h3>
                        <p>{texts['about.mission'] || "Yükleniyor..."}</p>
                    </div>
                    <div className="mv-card">
                        <h3>VİZYON</h3>
                        <p>{texts['about.vision'] || "Yükleniyor..."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;