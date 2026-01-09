import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventDetail.css";

function EventDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const BASE_URL = "https://localhost:7060"; //Burası backend portu ile aynı olmassa patlıyor ??(ilerde nasıl olcak ?)

    useEffect(() => {
        axios.get(`${BASE_URL}/api/events/${id}`)
            .then((res) => {
                setEvent(res.data.data ? res.data.data : res.data);
            })
            .catch((err) => console.error("Detay yüklenemedi:", err));
    }, [id]);

    if (!event) return <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Yükleniyor...</div>;

    return (
        <div className="event-detail">
            <div className="event-poster">
                <img src={event.posterUrl} alt={event.title} />
            </div>

            <div className="event-content">
                <h1>{event.title}</h1>
                <div className="event-meta">
                    <span className="event-date">📅 {new Date(event.date).toLocaleDateString()}</span>
                    {event.location && <span className="event-location">📍 {event.location}</span>}
                </div>
                <p className="event-description">{event.description}</p>
            </div>
        </div>
    );
}

export default EventDetail;