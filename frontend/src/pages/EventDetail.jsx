import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import "./EventDetail.css";

function EventDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        api.get(`/projeler/${id}`)
            .then((res) => {
                setEvent(res.data.data ? res.data.data : res.data);
            })
            .catch((err) => console.error("Detay çekilemedi:", err));
    }, [id]);

    if (!event) return <div style={{ textAlign: "center", padding: "50px" }}>Yükleniyor...</div>;

    return (
        <div className="detail-page-container">
            <div className="detail-card">

                <div className="detail-image-box">
                    <img
                        src={event.imageUrl || event.posterUrl || "/default-project.png"}
                        alt={event.title}
                        className="detail-page-image"
                    />
                </div>

                <div className="detail-content">
                    <h1 className="detail-title">{event.title}</h1>

                    <div className="detail-info">
                        <span className="info-item">📅 {new Date(event.eventDate || event.createdAt).toLocaleDateString("tr-TR")}</span>
                        <span className="info-item">📍 {event.location || "KTÜN Kampüsü"}</span>
                    </div>

                    <p className="detail-description">
                        {event.description}
                    </p>

                    <Link to="/projeler" className="detail-back-btn">
                        ← Listeye Dön
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default EventDetail;