import { useState, useEffect } from "react";
import api from "../api/axios";
import "./Admin.css";

// Takım Seçimi İçin Yardımcı Bileşen
const TeamSelect = ({ teamsList, value, onChange }) => (
    <select name="team" value={value} onChange={onChange} className="admin-select" required>
        <option value="">Bir Takım Seçiniz...</option>
        {teamsList.map(t => (
            <option key={t.id} value={t.name}>{t.name}</option>
        ))}
    </select>
);

const endpointMap = {
    projects: "/projeler",
    members: "/members",
    texts: "/sitetexts",
    applications: "/applications",
    teams: "/teams"
};

function Admin() {
    const [activeTab, setActiveTab] = useState("projects");
    const [data, setData] = useState([]);
    const [teamsList, setTeamsList] = useState([]);
    const [allMembers, setAllMembers] = useState([]); 
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const userRole = localStorage.getItem("adminRole");
    const userTeam = localStorage.getItem("adminTeam");
    
    // Senin yüklediğin default avatar dosya adı
    const defaultAvatar = "/default-avatar-profile-icon-social-600nw-1906669723.webp";

    const [formData, setFormData] = useState({
        title: "", description: "", name: "", imageUrl: "", titleMember: "", team: "", key: "", value: "",
        email: "", graduationNote: "", contactInfo: "", projects: "", githubUrl: "",
        category: "Diğer",
        projectMembers: [] 
    });

    const resetForm = () => {
        setFormData({
            title: "", description: "", name: "", imageUrl: "", titleMember: "", team: "", key: "", value: "",
            email: "", graduationNote: "", contactInfo: "", projects: "", githubUrl: "",
            category: "Diğer",
            projectMembers: []
        });
    };

    const handleAuthError = (err) => {
        if (err.response?.status === 401) {
            alert("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
            localStorage.clear();
            window.location.href = "/login";
        } else {
            console.error(err);
            alert("Bir işlem hatası oluştu.");
        }
    };

    const fetchData = () => {
        const endpoint = endpointMap[activeTab];
        if (!endpoint) return;

        api.get(endpoint)
            .then((res) => {
                let incomingData = res.data.data ? res.data.data : res.data;
                if (userRole === "TeamLead") {
                    if (activeTab === "members") incomingData = incomingData.filter(m => m.team === userTeam);
                    if (activeTab === "applications") incomingData = incomingData.filter(a => a.interestedTeam === userTeam);
                }
                setData(Array.isArray(incomingData) ? incomingData : [incomingData]);
            })
            .catch(handleAuthError);
    };

    useEffect(() => {
        api.get("/teams").then(res => setTeamsList(res.data.data || res.data));
        api.get("/members").then(res => setAllMembers(res.data.data || res.data));
    }, []);

    useEffect(() => { fetchData(); }, [activeTab]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Çoklu üye seçimini yöneten fonksiyon
    const handleMemberSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, projectMembers: selected });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = endpointMap[activeTab];
        let payload = {};

        if (activeTab === "projects") {
            payload = {
                id: editingItem ? editingItem.id : 0,
                title: formData.title,
                description: formData.description,
                imageUrl: formData.imageUrl,
                githubUrl: formData.githubUrl,
                team: formData.team || "Genel",
                category: formData.category,
                projectMembers: formData.projectMembers 
            };
        } else if (activeTab === "members") {
            const projectsArray = formData.projects ? formData.projects.split(',').map(p => p.trim()) : [];
            payload = {
                id: editingItem ? editingItem.id : 0,
                name: formData.name,
                title: formData.titleMember,
                imageUrl: formData.imageUrl,
                team: formData.team,
                email: formData.email,
                graduationNote: formData.graduationNote,
                contactInfo: formData.contactInfo,
                projects: projectsArray,
                isGraduated: formData.team === "Mezunlarımız"
            };
        } else if (activeTab === "texts") {
            payload = { id: editingItem.id, key: editingItem.key, value: formData.value };
        } else if (activeTab === "teams") {
            payload = { id: editingItem ? editingItem.id : 0, name: formData.name };
        }

        try {
            if (editingItem) {
                const id = editingItem.id || editingItem.key;
                await api.put(`${endpoint}/${id}`, payload);
            } else {
                await api.post(endpoint, payload);
            }
            alert("Başarıyla kaydedildi.");
            setModalOpen(false);
            setEditingItem(null);
            resetForm();
            fetchData();
        } catch (err) { handleAuthError(err); }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || "",
            description: item.description || "",
            name: item.name || "",
            imageUrl: item.imageUrl || "",
            titleMember: item.title || "",
            team: item.team || "",
            key: item.key || "",
            value: item.value || "",
            email: item.email || "",
            graduationNote: item.graduationNote || "",
            contactInfo: item.contactInfo || "",
            githubUrl: item.githubUrl || "",
            category: item.category || "Diğer",
            projects: item.projects ? item.projects.join(', ') : "",
            projectMembers: item.projectMembers || []
        });
        setModalOpen(true);
    };

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <div className="admin-logo">Topluluk Panel</div>
                <nav>
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
            </div>

            <div className="admin-content">
                <div className="admin-header">
                    <div className="admin-header-left">
                        <span className="user-team-badge">{userTeam || "Genel Yönetim"}</span>
                        <span className="user-role-text">{userRole}</span>
                    </div>
                    <button className="logout-btn-top" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Çıkış Yap 🚪</button>
                </div>

                <div className="admin-section">
                    <div className="section-header">
                        <h2>{activeTab.toUpperCase()}</h2>
                        {["projects", "members", "teams"].includes(activeTab) && (
                            <button className="add-btn" onClick={() => { setEditingItem(null); resetForm(); setModalOpen(true); }}>+ Yeni Ekle</button>
                        )}
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                {activeTab === "projects" && <><th>Başlık</th><th>Takım</th></>}
                                {activeTab === "members" && <><th>Görsel</th><th>İsim</th><th>Takım</th></>}
                                {activeTab === "applications" && <><th>Ad Soyad</th><th>Durum</th></>}
                                {activeTab === "teams" && <th>Takım Adı</th>}
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id || item.key}>
                                    <td>{item.id || "#"}</td>
                                    {activeTab === "projects" && (
                                        <>
                                            <td>{item.title}</td>
                                            <td>{item.team}</td>
                                        </>
                                    )}
                                    {activeTab === "members" && (
                                        <>
                                            <td>
                                                <img 
                                                    src={item.imageUrl || defaultAvatar} 
                                                    alt="" 
                                                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                                                    onError={(e) => { e.target.src = defaultAvatar; }}
                                                />
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.team}</td>
                                        </>
                                    )}
                                    {activeTab === "applications" && <><td>{item.firstName} {item.lastName}</td><td>{item.status}</td></>}
                                    {activeTab === "teams" && <td>{item.name}</td>}
                                    <td>
                                        <button onClick={() => handleEdit(item)}>Düzenle</button>
                                        {!["texts", "applications"].includes(activeTab) && (
                                            <button onClick={() => {
                                                if (window.confirm("Silinsin mi?")) {
                                                    api.delete(`${endpointMap[activeTab]}/${item.id}`).then(() => fetchData());
                                                }
                                            }}>Sil</button>
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
                            {activeTab === "projects" && (
                                <>
                                    <input type="text" name="title" placeholder="Proje Başlığı" value={formData.title} onChange={handleInputChange} required />
                                    <textarea name="description" placeholder="Açıklama" value={formData.description} onChange={handleInputChange} required />
                                    <TeamSelect teamsList={teamsList} value={formData.team} onChange={handleInputChange} />
                                    
                                    <div className="member-selection" style={{ marginTop: "10px" }}>
                                        <label style={{ fontSize: "12px", color: "#666" }}>Ekip Üyelerini Seç (Ctrl ile çoklu seçim):</label>
                                        <select multiple className="admin-select" value={formData.projectMembers} onChange={handleMemberSelect} style={{ height: "100px" }}>
                                            {allMembers.map(m => (
                                                <option key={m.id} value={m.name}>{m.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <input type="text" name="githubUrl" placeholder="GitHub Linki" value={formData.githubUrl} onChange={handleInputChange} />
                                    <input type="text" name="imageUrl" placeholder="Resim URL" value={formData.imageUrl} onChange={handleInputChange} />
                                </>
                            )}
                            {activeTab === "members" && (
                                <>
                                    <input type="text" name="name" placeholder="Ad Soyad" value={formData.name} onChange={handleInputChange} required />
                                    <input type="text" name="titleMember" placeholder="Unvan" value={formData.titleMember} onChange={handleInputChange} required />
                                    <input type="text" name="imageUrl" placeholder="Resim URL" value={formData.imageUrl} onChange={handleInputChange} />
                                    <TeamSelect teamsList={teamsList} value={formData.team} onChange={handleInputChange} />
                                </>
                            )}
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