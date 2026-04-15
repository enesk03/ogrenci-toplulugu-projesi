import { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const TeamSelect = ({ teamsList, value, onChange }) => (
    <select name="team" value={value} onChange={onChange} className="admin-select" required>
        <option value="">Bir Takım Seçiniz...</option>
        {teamsList.map(t => (
            <option key={t.id} value={t.name}>{t.name}</option>
        ))}
    </select>
);

function Admin() {
    const [activeTab, setActiveTab] = useState("events");
    const [data, setData] = useState([]);
    const [teamsList, setTeamsList] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const userRole = localStorage.getItem("adminRole");
    const userTeam = localStorage.getItem("adminTeam");
    const BASE_URL = "http://localhost:7060";

    const [formData, setFormData] = useState({
        title: "", description: "", date: "", location: "", posterUrl: "",
        name: "", imageUrl: "", titleMember: "", team: "", key: "", value: "",
        email: "", graduationNote: "", projects: "", githubUrl: ""
    });

    const getToken = () => localStorage.getItem("token");
    const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

    const resetForm = () => {
        setFormData({
            title: "", description: "", date: "", location: "", posterUrl: "",
            name: "", imageUrl: "", titleMember: "", team: "", key: "", value: "",
            email: "", graduationNote: "", projects: "", githubUrl: ""
        });
    };

    const fetchData = () => {
        let endpoint = "";
        if (activeTab === "events") endpoint = "/api/events";
        else if (activeTab === "projects") endpoint = "/api/projects";
        else if (activeTab === "members") endpoint = "/api/members";
        else if (activeTab === "texts") endpoint = "/api/sitetexts";
        else if (activeTab === "applications") endpoint = "/api/applications";
        else if (activeTab === "teams") endpoint = "/api/teams";

        axios.get(`${BASE_URL}${endpoint}`, getAuthHeader())
            .then((res) => {
                let incomingData = res.data.data ? res.data.data : res.data;
                if (userRole === "TeamLead") {
                    if (activeTab === "members") incomingData = incomingData.filter(m => m.team === userTeam);
                    if (activeTab === "applications") incomingData = incomingData.filter(a => a.interestedTeam === userTeam);
                }
                setData(Array.isArray(incomingData) ? incomingData : [incomingData]);
            })
            .catch((err) => { if (err.response?.status === 401) window.location.href = "/login"; });
    };

    useEffect(() => {
        axios.get(`${BASE_URL}/api/teams`, getAuthHeader())
            .then(res => setTeamsList(res.data.data ? res.data.data : res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => { fetchData(); }, [activeTab]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        let endpoint = "";
        let payload = {};

        if (activeTab === "events") {
            endpoint = "/api/events";
            payload = {
                id: editingItem ? editingItem.id : 0,
                title: formData.title, description: formData.description,
                eventDate: formData.date, location: formData.location,
                posterUrl: formData.posterUrl, organizerTeam: formData.team || "Yönetim"
            };
        } else if (activeTab === "projects") {
            endpoint = "/api/projects";
            payload = {
                id: editingItem ? editingItem.id : 0,
                title: formData.title,
                description: formData.description,
                imageUrl: formData.imageUrl,
                githubUrl: formData.githubUrl,
                team: formData.team || "Genel"
            };
        } else if (activeTab === "members") {
            endpoint = "/api/members";
            const projectsArray = formData.projects ? formData.projects.split(',').map(p => p.trim()).filter(p => p !== "") : [];
            payload = {
                id: editingItem ? editingItem.id : 0,
                name: formData.name, title: formData.titleMember,
                imageUrl: formData.imageUrl, team: formData.team,
                email: formData.email, graduationNote: formData.graduationNote,
                projects: projectsArray, isGraduated: formData.team === "Mezunlarımız"
            };
        } else if (activeTab === "texts") {
            endpoint = "/api/sitetexts";
            payload = { id: editingItem.id, key: editingItem.key, value: formData.value };
        } else if (activeTab === "teams") {
            endpoint = "/api/teams";
            payload = { id: editingItem ? editingItem.id : 0, name: formData.name };
        }

        try {
            if (editingItem) {
                const id = editingItem.id || editingItem.key;
                await axios.put(`${BASE_URL}${endpoint}/${id}`, payload, getAuthHeader());
            } else {
                await axios.post(`${BASE_URL}${endpoint}`, payload, getAuthHeader());
            }
            setModalOpen(false);
            setEditingItem(null);
            resetForm();
            fetchData();
        } catch { alert("İşlem başarısız oldu."); }
    };

    const handleApproveProject = (appId) => {
        axios.post(`${BASE_URL}/api/applications/approve-project/${appId}`, {}, getAuthHeader())
            .then(() => {
                alert("Üye projeye başarıyla eklendi!");
                fetchData();
            })
            .catch(() => alert("Hata oluştu."));
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || "",
            description: item.description || "",
            date: item.eventDate ? item.eventDate.substring(0, 16) : "",
            location: item.location || "",
            posterUrl: item.posterUrl || "",
            name: item.name || "",
            imageUrl: item.imageUrl || "",
            titleMember: item.title || "",
            team: item.team || item.organizerTeam || "",
            key: item.key || "",
            value: item.value || "",
            email: item.email || "",
            graduationNote: item.graduationNote || "",
            githubUrl: item.githubUrl || "",
            projects: item.projects ? item.projects.join(', ') : ""
        });
        setModalOpen(true);
    };

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <div className="admin-logo">Topluluk Panel</div>
                <nav>
                    <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>📅 Etkinlikler</button>
                    <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>🚀 Projeler</button>
                    <button className={activeTab === 'members' ? 'active' : ''} onClick={() => setActiveTab('members')}>👥 Üyeler</button>
                    <button className={activeTab === 'applications' ? 'active' : ''} onClick={() => setActiveTab('applications')}>🚀 Başvurular</button>
                    {userRole === "SuperAdmin" && (
                        <>
                            <button className={activeTab === 'teams' ? 'active' : ''} onClick={() => setActiveTab('teams')}>🏢 Takımlar</button>
                            <button className={activeTab === 'texts' ? 'active' : ''} onClick={() => setActiveTab('texts')}>✍️ Site Yazıları</button>
                        </>
                    )}
                </nav>
                <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Çıkış Yap</button>
            </div>

            <div className="admin-content">
                <div className="admin-section">
                    <div className="section-header">
                        <h2>{activeTab.toUpperCase()}</h2>
                        {["events", "projects", "members", "teams"].includes(activeTab) && (
                            <button className="add-btn" onClick={() => { setEditingItem(null); resetForm(); setModalOpen(true); }}>+ Yeni Ekle</button>
                        )}
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                {(activeTab === "events" || activeTab === "projects") && <><th>Başlık</th><th>Takım</th></>}
                                {activeTab === "members" && <><th>İsim</th><th>Takım</th></>}
                                {activeTab === "applications" && <><th>Ad Soyad</th><th>Detay/Proje</th><th>Durum</th></>}
                                {activeTab === "texts" && <><th>Anahtar</th><th>Değer</th></>}
                                {activeTab === "teams" && <th>Takım Adı</th>}
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id || item.key}>
                                    <td>{item.id || "#"}</td>
                                    {(activeTab === "events" || activeTab === "projects") && <><td>{item.title}</td><td>{item.organizerTeam || item.team}</td></>}
                                    {activeTab === "members" && <><td>{item.name}</td><td>{item.team}</td></>}
                                    {activeTab === "applications" && (
                                        <>
                                            <td>{item.firstName} {item.lastName}</td>
                                            <td>{item.interestedProject ? `PROJE: ${item.interestedProject}` : item.interestedTeam}</td>
                                            <td>{item.status}</td>
                                        </>
                                    )}
                                    {activeTab === "texts" && <><td>{item.key}</td><td>{item.value?.substring(0, 30)}...</td></>}
                                    {activeTab === "teams" && <td>{item.name}</td>}
                                    <td>
                                        {activeTab === "applications" && item.interestedProject && item.status === "Pending" && (
                                            <button onClick={() => handleApproveProject(item.id)} style={{ backgroundColor: '#2ecc71', color: 'white', marginRight: '5px' }}>Onayla</button>
                                        )}
                                        <button onClick={() => handleEdit(item)}>Düzenle</button>
                                        {!["texts", "applications"].includes(activeTab) && (
                                            <button onClick={() => { if (window.confirm("Silinsin mi?")) axios.delete(`${BASE_URL}/api/${activeTab}/${item.id}`, getAuthHeader()).then(() => fetchData()) }}>Sil</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingItem ? "Düzenle" : "Yeni Ekle"}</h3>
                        <form onSubmit={handleSubmit}>
                            {activeTab === "events" && (
                                <>
                                    <input type="text" name="title" placeholder="Başlık" value={formData.title} onChange={handleInputChange} required />
                                    <textarea name="description" placeholder="Açıklama" value={formData.description} onChange={handleInputChange} required />
                                    <input type="datetime-local" name="date" value={formData.date} onChange={handleInputChange} required />
                                    <input type="text" name="location" placeholder="Mekan" value={formData.location} onChange={handleInputChange} required />
                                    <input type="text" name="posterUrl" placeholder="Afiş URL" value={formData.posterUrl} onChange={handleInputChange} />
                                    <TeamSelect teamsList={teamsList} value={formData.team} onChange={handleInputChange} />
                                </>
                            )}
                            {activeTab === "projects" && (
                                <>
                                    <input type="text" name="title" placeholder="Proje Başlığı" value={formData.title} onChange={handleInputChange} required />
                                    <textarea name="description" placeholder="Proje Açıklaması" value={formData.description} onChange={handleInputChange} required />
                                    <input type="text" name="imageUrl" placeholder="Proje Kapak Resmi URL" value={formData.imageUrl} onChange={handleInputChange} />
                                    <input type="text" name="githubUrl" placeholder="GitHub Linki" value={formData.githubUrl} onChange={handleInputChange} />
                                    <TeamSelect teamsList={teamsList} value={formData.team} onChange={handleInputChange} />
                                </>
                            )}
                            {activeTab === "members" && (
                                <>
                                    <input type="text" name="name" placeholder="Ad Soyad" value={formData.name} onChange={handleInputChange} required />
                                    <input type="text" name="titleMember" placeholder="Unvan" value={formData.titleMember} onChange={handleInputChange} required />
                                    <input type="text" name="imageUrl" placeholder="Resim URL" value={formData.imageUrl} onChange={handleInputChange} />
                                    <TeamSelect teamsList={teamsList} value={formData.team} onChange={handleInputChange} />
                                    {formData.team === "Mezunlarımız" && (
                                        <>
                                            <textarea name="graduationNote" placeholder="Mezuniyet Notu" value={formData.graduationNote} onChange={handleInputChange} rows="3" />
                                            <input type="text" name="projects" placeholder="Projeler (Virgül ile)" value={formData.projects} onChange={handleInputChange} />
                                        </>
                                    )}
                                </>
                            )}
                            {activeTab === "texts" && (
                                <>
                                    <input type="text" value={formData.key} disabled />
                                    <textarea name="value" value={formData.value} onChange={handleInputChange} rows="8" />
                                </>
                            )}
                            {activeTab === "teams" && <input type="text" name="name" placeholder="Takım Adı" value={formData.name} onChange={handleInputChange} required />}

                            <div className="modal-buttons">
                                <button type="submit">Kaydet</button>
                                <button type="button" onClick={() => { setModalOpen(false); resetForm(); }}>İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;