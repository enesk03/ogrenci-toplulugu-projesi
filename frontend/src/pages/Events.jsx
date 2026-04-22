import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Events.css";

const ProjectCategorySection = ({ title, data, emoji }) => (
    data.length > 0 && (
        <section className="section-container">
            <h2 className="section-title">{emoji} {title}</h2>
            <div className="section-divider"></div>
            <div className="events-grid">
                {data.map((project) => (
                    <Link to={`/projeler/${project.id}`} key={project.id} className="card-link">
                        <div className="event-card project-card">
                            <div className="event-image-container">
                                <img src={project.imageUrl || "/default-project.png"} alt={project.title} className="event-image" />
                            </div>
                            <div className="event-content">
                                <h3 className="event-title">{project.title}</h3>
                                <p className="event-desc">{project.description}</p>
                                <div className="event-footer">
                                    <span className="project-team">🏗️ {project.team || "Genel"}</span>
                                    <span className="github-btn-fake">Detayları Gör →</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
);

function Events() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        api.get("/projeler")
            .then((res) => {
                const data = res.data.data ? res.data.data : res.data;
                setProjects(data);
            })
            .catch((err) => console.error("Projeler çekilemedi:", err));
    }, []);

    const tubitakProjects = projects.filter(p => p.category === "Tübitak");
    const teknolabProjects = projects.filter(p => p.category === "Teknolab");
    const otherProjects = projects.filter(p => p.category === "Diğer");

    return (
        <div className="events-page">
            <div className="events-header">
                <h1>Proje Portfolyomuz</h1>
                <p>Topluluğumuz tarafından geliştirilen Tübitak, Teknolab ve Ar-Ge projeleri.</p>
            </div>

            <ProjectCategorySection title="Tübitak Projeleri" data={tubitakProjects} emoji="🎓" />
            <ProjectCategorySection title="Teknolab Projeleri" data={teknolabProjects} emoji="🔬" />
            <ProjectCategorySection title="Diğer Projeler" data={otherProjects} emoji="💡" />
        </div>
    );
}

export default Events;