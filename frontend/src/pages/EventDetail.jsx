import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./EventDetail.css"; 

function EventDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const BASE_URL = "https://localhost:7060";

    useEffect(() => {
        axios.get(`${BASE_URL}/api/events/${id}`)
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
                        src={event.posterUrl}
                        alt={event.title}
                        className="detail-page-image"
                    />
                </div>

                <div className="detail-content">
                    <h1 className="detail-title">{event.title}</h1>

                    <div className="detail-info">
                        <span className="info-item">📅 {new Date(event.eventDate).toLocaleDateString("tr-TR")}</span>
                        <span className="info-item">📍 {event.location}</span>
                    </div>

                    <p className="detail-description">
                        {event.description}
                    </p>

                    <Link to="/etkinlikler" className="detail-back-btn">
                        ← Listeye Dön
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default EventDetail;