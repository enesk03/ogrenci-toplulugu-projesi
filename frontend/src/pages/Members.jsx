import { useEffect, useState } from "react";
import axios from "axios";
import "./Members.css";

function Members() {
    const [members, setMembers] = useState([]);
    const BASE_URL = "https://localhost:7060"; // Portu kontrol et!!!!

    useEffect(() => {
        axios.get(`${BASE_URL}/api/members`)
            .then((res) => {
                setMembers(res.data.data);
            })
            .catch((err) => console.error("Üyeler çekilemedi:", err));
    }, []);

    return (
        <div className="members-page">
            <section className="members-hero">
                <h1>Yönetim Kurulu</h1>
                <p>Topluluğumuzu ileriye taşıyan ekibimizle tanışın.</p>
            </section>

            <section className="members-grid">
                {members.length === 0 ? (
                    <p style={{ color: "#aaa" }}>Yükleniyor...</p>
                ) : (
                    members.map((member) => (
                        <div className="member-card" key={member.id}>
                            <img src={member.imageUrl} alt={member.name} />
                            <h3>{member.name}</h3>
                            <span>{member.title}</span>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}

export default Members;