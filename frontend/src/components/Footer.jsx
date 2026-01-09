import { useEffect, useState } from "react";
import axios from "axios";
import "./Footer.css";

function Footer() {
    const [texts, setTexts] = useState({});
    const BASE_URL = "https://localhost:7060";

    useEffect(() => {
        axios.get(`${BASE_URL}/api/sitetexts`)
            .then((res) => {
                
                const textObj = {};
                res.data.data.forEach(item => {
                    textObj[item.key] = item.value;
                });
                setTexts(textObj);
            })
            .catch((err) => console.error("Footer verisi çekilemedi", err));
    }, []);

    return (
        <footer className="site-footer">

            
            <div className="footer-top">
                <div className="footer-content">

                    {/* Sol: Ýletiþim */}
                    <div className="footer-left">
                        <h3>{texts['contact.header'] || "Bize Ulaþýn"}</h3>
                        <div className="underline"></div>

                        <p className="slogan">"{texts['contact.slogan']}"</p>

                        <p className="contact-details">
                            {texts['contact.email']} <br />
                            {texts['contact.phone']}
                        </p>
                    </div>

                    // Sað
                    <div className="footer-right">
                        <p className="newsletter-text">
                            {texts['contact.newsletter']}
                        </p>
                        <div className="newsletter-form">
                            <input type="text" placeholder="Email Adresiniz" />
                            <button>Abone Ol</button>
                        </div>
                    </div>

                </div>
            </div>

            
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <h4>{texts['footer.title'] || "Öðrenci Topluluðu"}</h4>
                    <p>{texts['footer.description']}</p>
                    <span className="copyright">
                        © {new Date().getFullYear()} {texts['footer.title']}. Tüm haklarý saklýdýr.
                    </span>
                </div>
            </div>

        </footer>
    );
}

export default Footer;