import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("events");

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin");
        if (!isAdmin) {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <h2 className="admin-logo">Yönetim Paneli</h2>
                <nav>
                    <button className={activeTab === "events" ? "active" : ""} onClick={() => setActiveTab("events")}>📅 Etkinlikler</button>
                    <button className={activeTab === "members" ? "active" : ""} onClick={() => setActiveTab("members")}>👥 Üyeler</button>
                    <button className={activeTab === "texts" ? "active" : ""} onClick={() => setActiveTab("texts")}>📝 Site Yazıları</button>
                    <button className="logout-btn" onClick={handleLogout}>🚪 Çıkış Yap</button>
                </nav>
            </aside>

            <main className="admin-content">
                {activeTab === "events" && <AdminEvents />}
                {activeTab === "members" && <AdminMembers />}
                {activeTab === "texts" && <AdminTexts />}
            </main>
        </div>
    );
}

//YÜKLEME FONKSİYONU 
const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const BASE_URL = "https://localhost:7060";

    try {
        const res = await axios.post(`${BASE_URL}/api/files/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data.url;
    } catch (error) {
        console.error("Dosya yüklenemedi", error);
        alert("Resim yüklenirken hata oluştu!");
        return null;
    }
};

//ETKİNLİK YÖNETİMİ
function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [newEvent, setNewEvent] = useState({
        title: "", description: "", location: "", date: "", posterUrl: ""
    });

    const BASE_URL = "https://localhost:7060";

    const fetchEvents = () => {
        axios.get(`${BASE_URL}/api/events`)
            .then(res => setEvents(res.data.data ? res.data.data : res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            const url = await uploadFile(file);
            setIsUploading(false);
            if (url) {
                setNewEvent(prev => ({ ...prev, posterUrl: url }));
            }
        }
    };

    const handleSave = () => {
        if (!newEvent.title || !newEvent.description) return alert("Başlık ve açıklama zorunlu.");

        axios.post(`${BASE_URL}/api/events`, {
            ...newEvent,
            eventDate: newEvent.date ? new Date(newEvent.date).toISOString() : new Date().toISOString()
        }).then(() => {
            alert("Etkinlik Eklendi!");
            setShowModal(false);
            fetchEvents();
            setNewEvent({ title: "", description: "", location: "", date: "", posterUrl: "" });
        }).catch(err => {
            console.error(err); 
            alert("Hata oluştu.");
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Silinsin mi?")) {
            axios.delete(`${BASE_URL}/api/events/${id}`).then(() => {
                setEvents(events.filter(e => e.id !== id));
            }).catch(err => console.error(err));
        }
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Etkinlik Listesi</h2>
                <button className="add-btn" onClick={() => setShowModal(true)}>+ Yeni Etkinlik</button>
            </div>
            <table className="admin-table">
                <thead><tr><th>Resim</th><th>Başlık</th><th>Tarih</th><th>İşlem</th></tr></thead>
                <tbody>
                    {events.map(e => (
                        <tr key={e.id}>
                            <td><img src={e.posterUrl} className="table-img" /></td>
                            <td>{e.title}</td>
                            <td>{new Date(e.eventDate).toLocaleDateString()}</td>
                            <td><button className="delete-btn" onClick={() => handleDelete(e.id)}>Sil</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Yeni Etkinlik</h3>
                        <label>Başlık</label><input type="text" name="title" value={newEvent.title} onChange={handleChange} />
                        <label>Açıklama</label><textarea name="description" value={newEvent.description} onChange={handleChange} />
                        <label>Tarih</label><input type="datetime-local" name="date" value={newEvent.date} onChange={handleChange} />
                        <label>Konum</label><input type="text" name="location" value={newEvent.location} onChange={handleChange} />

                        <label>Afiş Yükle</label>
                        <input type="file" onChange={handleFileChange} />
                        {isUploading && <p style={{ color: "orange" }}>Resim Yükleniyor...</p>}
                        {newEvent.posterUrl && <img src={newEvent.posterUrl} alt="Önizleme" style={{ width: "100px", marginTop: "10px" }} />}

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>İptal</button>
                            <button className="save-btn" onClick={handleSave} disabled={isUploading}>Kaydet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- ÜYE YÖNETİMİ ---
function AdminMembers() {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [newMember, setNewMember] = useState({ name: "", title: "", imageUrl: "", order: 0 });
    const BASE_URL = "https://localhost:7060";

    const fetchMembers = () => {
        axios.get(`${BASE_URL}/api/members`)
            .then(res => setMembers(res.data.data ? res.data.data : res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchMembers(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMember(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            const url = await uploadFile(file);
            setIsUploading(false);
            if (url) {
                setNewMember(prev => ({ ...prev, imageUrl: url }));
            }
        }
    };

    const handleSave = () => {
        if (!newMember.name) return alert("İsim zorunlu.");
        axios.post(`${BASE_URL}/api/members`, { ...newMember, order: parseInt(newMember.order) || 0 })
            .then(() => {
                alert("Üye Eklendi!");
                setShowModal(false);
                fetchMembers();
                setNewMember({ name: "", title: "", imageUrl: "", order: 0 });
            }).catch(err => {
                console.error(err); 
                alert("Hata oluştu.");
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Silinsin mi?")) {
            axios.delete(`${BASE_URL}/api/members/${id}`).then(() => {
                setMembers(members.filter(m => m.id !== id));
            }).catch(err => console.error(err));
        }
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Üyeler</h2>
                <button className="add-btn" onClick={() => setShowModal(true)}>+ Yeni Üye</button>
            </div>
            <table className="admin-table">
                <thead><tr><th>Foto</th><th>İsim</th><th>Ünvan</th><th>İşlem</th></tr></thead>
                <tbody>
                    {members.map(m => (
                        <tr key={m.id}>
                            <td><img src={m.imageUrl} className="table-img" style={{ borderRadius: "50%" }} alt="" /></td>
                            <td>{m.name}</td>
                            <td>{m.title}</td>
                            <td><button className="delete-btn" onClick={() => handleDelete(m.id)}>Sil</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Yeni Üye</h3>
                        <label>Ad Soyad</label><input type="text" name="name" value={newMember.name} onChange={handleChange} />
                        <label>Ünvan</label><input type="text" name="title" value={newMember.title} onChange={handleChange} />
                        <label>Sıralama</label><input type="number" name="order" value={newMember.order} onChange={handleChange} />

                        <label>Fotoğraf Yükle</label>
                        <input type="file" onChange={handleFileChange} />
                        {isUploading && <p style={{ color: "orange" }}>Yükleniyor...</p>}
                        {newMember.imageUrl && <img src={newMember.imageUrl} alt="Önizleme" style={{ width: "80px", borderRadius: "50%", marginTop: "10px" }} />}

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>İptal</button>
                            <button className="save-btn" onClick={handleSave} disabled={isUploading}>Kaydet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

//SİTE YAZILARI YÖNETİMİ
function AdminTexts() {
    const [texts, setTexts] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [newValue, setNewValue] = useState("");
    const BASE_URL = "https://localhost:7060";

    const fetchTexts = () => {
        axios.get(`${BASE_URL}/api/sitetexts`)
            .then(res => setTexts(res.data.data ? res.data.data : res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchTexts(); }, []);

    const handleEditClick = (item) => {
        setEditingItem(item);
        setNewValue(item.value);
    };

    const handleSave = () => {
        axios.put(`${BASE_URL}/api/sitetexts`, { key: editingItem.key, value: newValue })
            .then(() => {
                alert("Güncellendi!");
                setEditingItem(null);
                fetchTexts();
            })
            .catch(err => console.error(err)); 
    };

    return (
        <div className="admin-section">
            <div className="section-header"><h2>Site Yazıları</h2></div>
            <table className="admin-table">
                <thead><tr><th>Key</th><th>Value</th><th>İşlem</th></tr></thead>
                <tbody>
                    {texts.map(t => (
                        <tr key={t.id}>
                            <td style={{ fontWeight: "bold", color: "#b52525" }}>{t.key}</td>
                            <td>{t.value.substring(0, 50)}...</td>
                            <td><button className="add-btn" style={{ backgroundColor: "#333" }} onClick={() => handleEditClick(t)}>Düzenle</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingItem && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Düzenle: {editingItem.key}</h3>
                        <textarea rows="5" value={newValue} onChange={(e) => setNewValue(e.target.value)}></textarea>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setEditingItem(null)}>İptal</button>
                            <button className="save-btn" onClick={handleSave}>Güncelle</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;