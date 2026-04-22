import { useState, useEffect } from "react";
import api from "../api/axios";
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
    const [activeTab, setActiveTab] = useState("projects");
    const [data, setData] = useState([]);
    const [teamsList, setTeamsList] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const userRole = localStorage.getItem("adminRole");
    const userTeam = localStorage.getItem("adminTeam");

    const [formData, setFormData] = useState({
        title: "", description: "", name: "", imageUrl: "", titleMember: "", team: "", key: "", value: "",
        email: "", graduationNote: "", contactInfo: "", projects: "", githubUrl: "",
        category: "Diğer"
    });

    const resetForm = () => {
        setFormData({
            title: "", description: "", name: "", imageUrl: "", titleMember: "", team: "", key: "", value: "",
            email: "", graduationNote: "", contactInfo: "", projects: "", githubUrl: "",
            category: "Diğer"
        });
    };

    const fetchData = () => {
        let endpoint = "";
        if (activeTab === "projects") endpoint = "/projeler";
        else if (activeTab === "members") endpoint = "/members";
        else if (activeTab === "texts") endpoint = "/sitetexts";
        else if (activeTab === "applications") endpoint = "/applications";
        else if (activeTab === "teams") endpoint = "/teams";

        api.get(endpoint)
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
        api.get("/teams")
            .then(res => setTeamsList(res.data.data ? res.data.data : res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => { fetchData(); }, [activeTab]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let endpoint = "";
        let payload = {};

        if (activeTab === "projects") {
            endpoint = "/projeler";
            payload = {
                id: editingItem ? editingItem.id : 0,
                title: formData.title,
                description: formData.description,
                imageUrl: formData.imageUrl,
                githubUrl: formData.githubUrl,
                team: formData.team || "Genel",
                category: formData.category
            };
        } else if (activeTab === "members") {
            endpoint = "/members";
            const projectsArray = formData.projects ? formData.projects.split(',').map(p => p.trim()).filter(p => p !== "") : [];
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
            endpoint = "/sitetexts";
            payload = { id: editingItem.id, key: editingItem.key, value: formData.value };
        } else if (activeTab === "teams") {
            endpoint = "/teams";
            payload = { id: editingItem ? editingItem.id : 0, name: formData.name };
        }

        try {
            if (editingItem) {
                const id = editingItem.id || editingItem.key;
                await api.put(`${endpoint}/${id}`, payload);
            } else {
                await api.post(endpoint, payload);
            }
            setModalOpen(false);
            setEditingItem(null);
            resetForm();
            fetchData();
        } catch { alert("İşlem başarısız oldu."); }
    };

    const handleApproveProject = (appId) => {
        api.post(`/applications/approve-project/${appId}`, {})
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
            projects: item.projects ? item.projects.join(', ') : ""
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
                    <button className="logout-btn-top" onClick={handleLogout}>Çıkış Yap 🚪</button>
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
                                {activeTab === "projects" && <><th>Başlık</th><th>Takım</th><th>Kategori</th></>}
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
                                    {activeTab === "projects" && (
                                        <>
                                            <td>{item.title}</td>
                                            <td>{item.team}</td>
                                            <td>{item.category}</td>
                                        </>
                                    )}
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
                                            <button onClick={() => {
                                                if (window.confirm("Silinsin mi?")) {
                                                    const deleteEndpoint = activeTab === 'projects' ? '/projeler' : `/${activeTab}`;
                                                    api.delete(`${deleteEndpoint}/${item.id}`).then(() => fetchData());
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
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="admin-select" required>
                                        <option value="Tübitak">Tübitak Projesi</option>
                                        <option value="Teknolab">Teknolab Projesi</option>
                                        <option value="Diğer">Diğer Projeler</option>
                                    </select>
                                    <textarea name="description" placeholder="Proje Açıklaması" value={formData.description} onChange={handleInputChange} required />
                                    <input type="text" name="imageUrl" placeholder="Proje Kapak Resmi URL" value={formData.imageUrl} onChange={handleInputChange} />
                                    <input type="text" name="githubUrl" placeholder="GitHub Linki" value={formData.githubUrl} onChange={handleInputChange} />
                                    <TeamSelect teamsList={teamsList} value={formData.team} onChange={handleInputChange} />
                                </>
                            )}
                            {activeTab === "members" && (
                                <>
                                    <input type="text" name="name" placeholder="Ad Soyad" value={formData.name} onChange={handleInputChange} required />
                                    <input type="text" name="titleMember" placeholder={formData.team === "Mezunlarımız" ? "İş Unvanı (Örn: İş Bankası Yazılım)" : "Unvan"} value={formData.titleMember} onChange={handleInputChange} required />
                                    <input type="text" name="imageUrl" placeholder="Resim URL" value={formData.imageUrl} onChange={handleInputChange} />
                                    <TeamSelect teamsList={teamsList} value={formData.team} onChange={handleInputChange} />
                                    {formData.team === "Mezunlarımız" && (
                                        <>
                                            <textarea name="graduationNote" placeholder="Mezuniyet Yorumu / Notu" value={formData.graduationNote} onChange={handleInputChange} rows="3" />
                                            <input type="text" name="contactInfo" placeholder="İletişim (LinkedIn vb.)" value={formData.contactInfo} onChange={handleInputChange} />
                                        </>
                                    )}
                                    <input type="text" name="projects" placeholder="Katıldığı Projeler (Virgül ile)" value={formData.projects} onChange={handleInputChange} />
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