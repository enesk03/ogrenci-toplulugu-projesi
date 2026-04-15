import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Events.css";

function Events() {
    const [events, setEvents] = useState([]);
    const [projects, setProjects] = useState([]);
    const BASE_URL = "http://localhost:7060";

    useEffect(() => {
        axios.get(`${BASE_URL}/api/events`)
            .then((res) => {
                setEvents(res.data.data ? res.data.data : res.data);
            })
            .catch((err) => console.error(err));

        axios.get(`${BASE_URL}/api/projects`)
            .then((res) => {
                setProjects(res.data.data ? res.data.data : res.data);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="events-page">
            <div className="events-header">
                <h1>Etkinlik ve Projelerimiz</h1>
                <p>Topluluğumuzun düzenlediği etkinlikler ve geliştirdiği projeler.</p>
            </div>

            <section className="section-container">
                <h2 className="section-title">📅 Yaklaşan Etkinlikler</h2>
                <div className="section-divider"></div>
                <div className="events-grid">
                    {events.map((event) => (
                        <Link to={`/etkinlikler/${event.id}`} key={event.id} className="card-link">
                            <div className="event-card">
                                <div className="event-image-container">
                                    <img src={event.posterUrl} alt={event.title} className="event-image" />
                                </div>
                                <div className="event-content">
                                    <h3 className="event-title">{event.title}</h3>
                                    <p className="event-desc">{event.description}</p>
                                    <div className="event-footer">
                                        <span className="event-date">
                                            📅 {new Date(event.eventDate || event.date).toLocaleDateString("tr-TR")}
                                        </span>
                                        <span className="event-location">
                                            📍 {event.location || "Online"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="section-container project-section-margin">
                <h2 className="section-title">🚀 Geliştirdiğimiz Projeler</h2>
                <div className="section-divider"></div>
                <div className="events-grid">
                    {projects.map((project) => (
                        <Link to={`/projeler/${project.id}`} key={project.id} className="card-link">
                            <div className="event-card project-card">
                                <div className="event-image-container">
                                    <img src={project.imageUrl} alt={project.title} className="event-image" />
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
        </div>
    );
}

export default Events;