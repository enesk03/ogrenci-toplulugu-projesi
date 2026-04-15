import { useEffect, useState } from "react";
import axios from "axios";
import "./Members.css";

function Members() {
    const [groupedMembers, setGroupedMembers] = useState({});
    const BASE_URL = "http://localhost:7060";

    const processMembers = (members) => {
        const groups = {};
        const topTeamName = "Yönetim Kurulu";

        groups[topTeamName] = [];

        members.forEach((member) => {
            let teamName = member.team && member.team.trim() !== "" ? member.team : topTeamName;
            if (!groups[teamName]) {
                groups[teamName] = [];
            }
            groups[teamName].push(member);
        });

        setGroupedMembers(groups);
    };

    useEffect(() => {
        axios.get(`${BASE_URL}/api/members`)
            .then((res) => {
                const data = res.data.data ? res.data.data : res.data;
                console.log("DB'den Gelen Ham Veri:", data[0]);
                processMembers(data);
            })
            .catch((err) => console.error("Üyeler çekilemedi:", err));
    }, []); 

    return (
        <div className="members-page">
            <div className="members-header">
                <h1>Ekibimiz</h1>
                <p>Topluluğumuza değer katan ekiplerimiz ve üyelerimiz.</p>
            </div>

            {Object.keys(groupedMembers).map((teamName) => (
                groupedMembers[teamName].length > 0 && (
                    <div key={teamName} className={`team-section ${teamName === "Mezunlarımız" ? "alumni-section" : ""}`}>
                        <h2 className="team-title">{teamName}</h2>
                        <div className="team-divider"></div>

                        <div className="members-grid">
                            {groupedMembers[teamName].map((member) => (
                                <div key={member.id} className={`member-card ${teamName === "Mezunlarımız" ? "alumni-card" : ""}`}>
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

                                        {teamName === "Mezunlarımız" && (
                                            <>
                                                {member.graduationNote && (
                                                    <p className="alumni-note">"{member.graduationNote}"</p>
                                                )}
                                                {member.projects && member.projects.length > 0 && (
                                                    <div className="project-list">
                                                        {member.projects.map((p, idx) => (
                                                            <span key={idx} className="project-badge">{p}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
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