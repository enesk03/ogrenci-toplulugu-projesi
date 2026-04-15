import { useEffect, useState } from "react";
import axios from "axios";
import "./Contact.css";

function Contact() {
    const [contactInfo, setContactInfo] = useState({
        email: "...",
        instagram: "..."
    });

    const BASE_URL = "http://localhost:7060";

    useEffect(() => {
        axios.get(`${BASE_URL}/api/sitetexts`)
            .then((res) => {
                const texts = res.data.data;

                const emailObj = texts.find(t => t.key === 'contact.email');
                const instaObj = texts.find(t => t.key === 'contact.instagram');

                setContactInfo({
                    email: emailObj ? emailObj.value : "topluluk@ktun.edu.tr",
                    instagram: instaObj ? instaObj.value : "@ktun_topluluk"
                });
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="contact-page">
            <div className="contact-container">

                {/* SOL TARAF - KTÜN Renkleri */}
                <div className="contact-info">
                    <h1>İletişime Geç</h1>

                    <p className="contact-desc">
                        Konya Teknik Üniversitesi öğrenci topluluğumuz hakkında bilgi almak,
                        etkinliklerimize katılmak veya sorularınız için bize ulaşın.
                    </p>

                    <div className="info-item">
                        <strong>E-posta:</strong>
                        <span>{contactInfo.email}</span>
                    </div>

                    <div className="info-item">
                        <strong>Instagram:</strong>
                        <span>{contactInfo.instagram}</span>
                    </div>

                    <div className="info-item">
                        <strong>Üniversite:</strong>
                        <span>Konya Teknik Üniversitesi</span>
                    </div>
                </div>

                {/* SAĞ TARAF - Form */}
                <div className="contact-form">
                    <input type="text" placeholder="Adınız Soyadınız" />
                    <input type="email" placeholder="E-posta Adresiniz" />
                    <textarea placeholder="Mesajınız" rows="5"></textarea>
                    <button>GÖNDER</button>
                </div>

            </div>
        </div>
    );
}

export default Contact;