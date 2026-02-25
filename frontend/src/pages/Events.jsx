import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Events.css";

function Events() {
    const [events, setEvents] = useState([]);
    const BASE_URL = "https://localhost:7060";

    useEffect(() => {
        axios.get(`${BASE_URL}/api/events`)
            .then((response) => {
                // API'den gelen veriyi güvenli şekilde al
                setEvents(response.data.data ? response.data.data : response.data);
            })
            .catch((error) => console.error("Hata:", error));
    }, []);

    return (
        <div className="events-page">
            <div className="events-header">
                <h1>Etkinliklerimiz</h1>
                <p>Topluluğumuzun düzenlediği atölye, seminer ve buluşmalar.</p>
            </div>

            <div className="events-grid">
                {events.map((event) => (
                    // Link'i kapsayıcı olarak kullanıyoruz
                    <Link to={`/etkinlikler/${event.id}`} key={event.id} style={{ textDecoration: 'none', color: 'inherit' }}>

                        <div className="event-card">

                            {/* --- RESİM ALANI (CSS'teki .event-image-container burayı arıyor) --- */}
                            <div className="event-image-container">
                                <img
                                    src={event.posterUrl}
                                    alt={event.title}
                                    className="event-image"
                                />
                            </div>

                            {/* --- İÇERİK ALANI (CSS'teki .event-content burayı arıyor) --- */}
                            <div className="event-content">
                                <h3 className="event-title">{event.title}</h3>

                                {/* Açıklama varsa göster, yoksa boş geç */}
                                <p className="event-desc">{event.description}</p>

                                {/* --- KART ALT BİLGİSİ (CSS'teki .event-footer burayı arıyor) --- */}
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
        </div>
    );
}

export default Events;