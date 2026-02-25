import { useState, useEffect } from "react";
import axios from "axios";
import "./Contact.css"; 

function Apply() {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        department: "", grade: "", interestedTeam: "", reason: ""
    });

    // 🔥 Dinamik takımlar için state
    const [teams, setTeams] = useState([]);

    const BASE_URL = "https://localhost:7060";

    // 🔥 Sayfa açılınca takımları çek
    useEffect(() => {
        axios.get(`${BASE_URL}/api/teams`)
            .then(res => {
                // Backend'den gelen veri yapısını kontrol et
                const data = res.data.data ? res.data.data : res.data;
                setTeams(data);
            })
            .catch(err => console.error("Takımlar yüklenemedi:", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/applications`, formData);
            alert("Başvurunuz başarıyla alındı! Size dönüş yapacağız.");
            // Formu temizle
            setFormData({
                firstName: "", lastName: "", email: "", phone: "",
                department: "", grade: "", interestedTeam: "", reason: ""
            });
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu.");
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-container" style={{ maxWidth: "800px" }}>
                {/* SOL TARAF SÜS */}
                <div className="contact-info" style={{ flex: "0.5" }}>
                    <h1>Aramıza Katıl 🚀</h1>
                    <p className="contact-desc">
                        Teknoloji, sanat ve girişimcilik dolu dünyamıza adım at.
                        Kendini geliştirmek ve projelerde yer almak için formu doldurman yeterli.
                    </p>
                </div>

                {/* SAĞ TARAF FORM */}
                <div className="contact-form">
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <input type="text" name="firstName" placeholder="Adın" value={formData.firstName} onChange={handleChange} required style={{ flex: 1 }} />
                            <input type="text" name="lastName" placeholder="Soyadın" value={formData.lastName} onChange={handleChange} required style={{ flex: 1 }} />
                        </div>

                        <input type="email" name="email" placeholder="E-Posta Adresin" value={formData.email} onChange={handleChange} required />
                        <input type="text" name="phone" placeholder="Telefon Numaran" value={formData.phone} onChange={handleChange} required />

                        <div style={{ display: "flex", gap: "10px" }}>
                            <input type="text" name="department" placeholder="Bölümün" value={formData.department} onChange={handleChange} required style={{ flex: 1 }} />
                            <select name="grade" value={formData.grade} onChange={handleChange} required style={{ flex: 1, padding: "15px", background: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px" }}>
                                <option value="">Sınıf Seç</option>
                                <option value="Hazırlık">Hazırlık</option>
                                <option value="1">1. Sınıf</option>
                                <option value="2">2. Sınıf</option>
                                <option value="3">3. Sınıf</option>
                                <option value="4">4. Sınıf</option>
                            </select>
                        </div>

                        {/* 🔥 DİNAMİK TAKIM KUTUSU */}
                        <select
                            name="interestedTeam"
                            value={formData.interestedTeam}
                            onChange={handleChange}
                            required
                            style={{ padding: "15px", background: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px" }}
                        >
                            <option value="">İlgilendiğin Takım</option>

                            {/* Veritabanından gelen takımları listele */}
                            {teams.map(t => (
                                <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                        </select>

                        <textarea name="reason" placeholder="Neden aramıza katılmak istiyorsun?" rows="4" value={formData.reason} onChange={handleChange} required></textarea>

                        <button type="submit">BAŞVURU YAP</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Apply;