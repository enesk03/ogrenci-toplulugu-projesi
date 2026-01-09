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
        setEvents(response.data.data ? response.data.data : response.data);
      })
      .catch((error) => console.error("Hata:", error));
  }, []);

  // Tarihi formatlamak için yardımcı fonksiyon
  const getDateParts = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('tr-TR', { month: 'short' }),
      full: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  };

  return (
    <div className="events-page">
      <section className="events-hero">
        <h1> Etkinliklerimiz </h1>
        <p>Topluluğumuzun düzenlediği atölye, seminer ve buluşmalar.</p>
      </section>

      <section className="events-grid">
        {events.map((event) => {
          const { day, month } = getDateParts(event.eventDate || event.date);
          return (
            <Link to={`/etkinlikler/${event.id}`} key={event.id} className="event-card">
              
              <div className="card-image-wrapper">
                <img src={event.posterUrl} alt={event.title} />
                <div className="date-badge">
                  <span className="day">{day}</span>
                  <span className="month">{month}</span>
                </div>
              </div>

              <div className="event-info">
                <h3>{event.title}</h3>
                <span className="event-location">📍 {event.location || "Online"}</span>
                <span className="read-more">Detayları Gör →</span>
              </div>

            </Link>
          );
        })}
      </section>
    </div>
  );
}

export default Events;