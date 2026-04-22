import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Members.css";

function Members() {
    const [groupedMembers, setGroupedMembers] = useState({});

    const processMembers = (members) => {
        const groups = {};
        const topTeamName = "Yönetim Kurulu";

        const activeMembers = members.filter(m => m.team !== "Mezunlarımız" && m.isGraduated !== true);

        groups[topTeamName] = [];

        activeMembers.forEach((member) => {
            let teamName = member.team && member.team.trim() !== "" ? member.team : topTeamName;
            if (!groups[teamName]) {
                groups[teamName] = [];
            }
            groups[teamName].push(member);
        });

        setGroupedMembers(groups);
    };

    useEffect(() => {
        api.get("/members")
            .then((res) => {
                const data = res.data.data ? res.data.data : res.data;
                processMembers(data);
            })
            .catch((err) => console.error("Üyeler çekilemedi:", err));
    }, []);

    return (
        <div className="members-page">
            <div className="members-header">
                <h1>Ekibimiz</h1>
                <p>Topluluğumuza değer katan aktif ekiplerimiz ve üyelerimiz.</p>
            </div>

            {Object.keys(groupedMembers).map((teamName) => (
                groupedMembers[teamName].length > 0 && (
                    <div key={teamName} className="team-section">
                        <h2 className="team-title">{teamName}</h2>
                        <div className="team-divider"></div>

                        <div className="members-grid">
                            {groupedMembers[teamName].map((member) => (
                                <div key={member.id} className="member-card">
                                    <div className="member-image-wrapper">
                                        <img
                                            src={member.imageUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
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