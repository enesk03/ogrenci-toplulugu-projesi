import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Alumni.css";

function Alumni() {
    const [alumni, setAlumni] = useState([]);

    useEffect(() => {
        api.get("/members")
            .then((res) => {
                const allData = res.data.data ? res.data.data : res.data;
                const filteredAlumni = allData.filter(m => m.team === "Mezunlarımız" || m.isGraduated === true);
                setAlumni(filteredAlumni);
            })
            .catch((err) => console.error(err));
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr || new Date(dateStr).getFullYear() <= 1) return "Yeni Mezun";
        const date = new Date(dateStr);
        return date.toLocaleDateString("tr-TR", {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="alumni-page">
            <div className="alumni-header">
                <h1>🎓 Mezunlar Portfolyosu</h1>
                <p>Topluluğumuzdan sektöre adım atan gurur tablolarımız.</p>
            </div>

            <div className="alumni-list">
                {alumni.map((person) => (
                    <div key={person.id} className="alumni-horizontal-card">
                        <div className="alumni-image-side">
                            <img src={person.imageUrl || "/default-avatar.png"} alt={person.name} />
                        </div>

                        <div className="alumni-info-side">
                            <div className="alumni-main-info">
                                <h3 className="alumni-name">{person.name}</h3>
                                <div className="alumni-job-title">{person.title}</div>
                            </div>

                            <p className="alumni-quote">"{person.graduationNote || "Topluluğumuzun bir parçası olmaktan gurur duyuyorum."}"</p>

                            <div className="alumni-meta-info">
                                <div className="alumni-contact-text">
                                    {person.contactInfo ? (
                                        <span>👤 {person.contactInfo}</span>
                                    ) : (
                                        <span className="no-contact">İletişim belirtilmedi</span>
                                    )}
                                </div>
                                <div className="alumni-date">
                                    📅 Mezuniyet: {formatDate(person.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Alumni;