import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import "./ProjectDetail.css";

function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const defaultAvatar = "/default-avatar-profile-icon-social-600nw-1906669723.webp";

    const formatUrl = (url) => {
        if (!url) return "#";
        return url.startsWith("http") ? url : `https://${url}`;
    };

    useEffect(() => {
        api.get(`/projeler/${id}`)
            .then(res => {
                setProject(res.data.data ? res.data.data : res.data);
            })
            .catch(err => console.error("Proje yüklenirken hata oluştu:", err));
    }, [id]);

    if (!project) return <div className="detail-page-container">Yükleniyor...</div>;

    return (
        <div className="detail-page-container">
            <div className="detail-card">
                <div className="detail-image-box">
                    <img
                        src={project.imageUrl || "/default-project.png"}
                        alt={project.title}
                        className="detail-page-image"
                    />
                </div>

                <div className="detail-content">
                    <h1 className="detail-title">{project.title}</h1>

                    <div className="detail-info">
                        <span>🏗️ Takım: {project.team}</span>
                        {project.githubUrl && <span>💻 Kaynak Kod Mevcut</span>}
                    </div>

                    <div className="detail-description">
                        {project.description}
                    </div>

                    {/* Proje Ekibi Bölümü */}
                    <div className="project-team-section" style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                        <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                            🚀 Proje Ekibi
                        </h3>
                        <div className="project-members-grid" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                            {project.projectMembers && project.projectMembers.length > 0 ? (
                                project.projectMembers.map((mName, index) => (
                                    <div key={index} className="member-mini-card" style={{ textAlign: "center", width: "80px" }}>
                                        <img 
                                            src={defaultAvatar} 
                                            alt={mName} 
                                            style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid #3498db" }}
                                            onError={(e) => { e.target.src = defaultAvatar; }}
                                        />
                                        <p style={{ fontSize: "11px", marginTop: "8px", fontWeight: "bold", color: "#2c3e50" }}>{mName}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: "#95a5a6", fontStyle: "italic" }}>Bu projeye henüz ekip üyesi atanmamış.</p>
                            )}
                        </div>
                    </div>

                    <div className="detail-actions" style={{ marginTop: "40px" }}>
                        <Link to="/projeler" className="detail-back-btn">← Geri Dön</Link>
                        {project.githubUrl && (
                            <a
                                href={formatUrl(project.githubUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="detail-github-btn"
                            >
                                GitHub'da İncele →
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetail;