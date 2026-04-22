import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import "./ProjectDetail.css";

function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [sent, setSent] = useState(false);
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });

    const formatUrl = (url) => {
        if (!url) return "#";
        return url.startsWith("http") ? url : `https://${url}`;
    };

    useEffect(() => {
        api.get(`/projeler/${id}`)
            .then(res => {
                setProject(res.data.data ? res.data.data : res.data);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            interestedProject: project.title,
            status: "Pending"
        };
        try {
            await api.post("/applications", payload);
            setSent(true);
        } catch {
            alert("Başvuru gönderilemedi.");
        }
    };

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

                    <div className="application-section">
                        {sent ? (
                            <div className="success-message">
                                <h3>Başvurunuz Alındı!</h3>
                                <p>Admin onayından sonra projeye dahil edileceksiniz.</p>
                            </div>
                        ) : (
                            <div className="project-app-form">
                                <h3>🚀 Bu Projeye Katıl</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="Adınız"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Soyadınız"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="E-posta Adresiniz"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                    <button type="submit" className="apply-btn">Başvuruyu Tamamla</button>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="detail-actions">
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