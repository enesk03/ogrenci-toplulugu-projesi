import { useEffect, useState } from "react";
import axios from "axios";
import "./Members.css";

function Members() {
    const [groupedMembers, setGroupedMembers] = useState({});
    const BASE_URL = "https://localhost:7060";

    const groupMembersByTeam = (members) => {
        const groups = {};

        // 1. Önce "Yönetim Kurulu" veya Takımsızları ayır
        const topTeamName = "Yönetim Kurulu";
        groups[topTeamName] = [];

        members.forEach((member) => {
            // Eğer takımı yoksa veya boşsa 'Yönetim Kurulu' varsayalım
            let teamName = member.team && member.team.trim() !== "" ? member.team : topTeamName;

            // Grubu oluştur
            if (!groups[teamName]) {
                groups[teamName] = [];
            }
            groups[teamName].push(member);
        });

        setGroupedMembers(groups);
    };

    // Şimdi useEffect güvenle çalışabilir
    useEffect(() => {
        axios.get(`${BASE_URL}/api/members`)
            .then((res) => {
                const data = res.data.data ? res.data.data : res.data;
                groupMembersByTeam(data);
            })
            .catch((err) => console.error("Üyeler çekilemedi:", err));

    }, []);

    return (
        <div className="members-page">
            <div className="members-header">
                <h1>Ekibimiz</h1>
                <p>Topluluğumuza değer katan ekiplerimiz ve üyelerimiz.</p>
            </div>

            {/* GRUPLARI LİSTELE */}
            {Object.keys(groupedMembers).map((teamName) => (

                // Eğer o takımda üye yoksa gösterme
                groupedMembers[teamName].length > 0 && (
                    <div key={teamName} className="team-section">

                        {/* TAKIM BAŞLIĞI */}
                        <h2 className="team-title">{teamName}</h2>
                        <div className="team-divider"></div>

                        {/* O TAKIMIN ÜYELERİ (GRID) */}
                        <div className="members-grid">
                            {groupedMembers[teamName].map((member) => (
                                <div key={member.id} className="member-card">

                                    <div className="member-image-wrapper">
                                        <img
                                            src={member.imageUrl}
                                            alt={member.name}
                                            className="member-image"
                                            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                                        />
                                    </div>

                                    <div className="member-info">
                                        <h3>{member.name}</h3>
                                        <span className="member-title">{member.title}</span>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}

export default Members;