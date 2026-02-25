import { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

function Admin() {
    const [activeTab, setActiveTab] = useState("events");
    const [data, setData] = useState([]);
    const [teamsList, setTeamsList] = useState([]); // 🔥 Ekipleri tutacak liste
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const userRole = localStorage.getItem("adminRole");
    const userTeam = localStorage.getItem("adminTeam");

    const [formData, setFormData] = useState({
        title: "", description: "", date: "", location: "", posterUrl: "",
        name: "", imageUrl: "", titleMember: "", team: "",
        key: "", value: ""
    });

    const BASE_URL = "https://localhost:7060";

    // 1. TAKIMLARI ÇEK (Dropdownlar için gerekli)
    const fetchTeams = () => {
        axios.get(`${BASE_URL}/api/teams`)
            .then(res => {
                // Backend yapına göre .data veya .data.data olabilir
                setTeamsList(res.data.data ? res.data.data : res.data);
            })
            .catch(err => console.error("Takımlar çekilemedi:", err));
    };

    // Sayfa açılınca takımları getir
    useEffect(() => {
        fetchTeams();
    }, []);

    // 2. LİSTE VERİLERİNİ ÇEK
    const fetchData = () => {
        let endpoint = "";
        if (activeTab === "events") endpoint = "/api/events";
        else if (activeTab === "members") endpoint = "/api/members";
        else if (activeTab === "texts") endpoint = "/api/sitetexts";
        else if (activeTab === "applications") endpoint = "/api/applications";
        else if (activeTab === "teams") endpoint = "/api/teams"; // 🔥 Yeni Sekme

        axios.get(`${BASE_URL}${endpoint}`)
            .then((res) => {
                let incomingData = res.data.data ? res.data.data : res.data;

                // Takım lideri kısıtlaması
                if (userRole === "TeamLead") {
                    if (activeTab === "members") {
                        incomingData = incomingData.filter(m => m.team === userTeam);
                    }
                    if (activeTab === "applications") {
                        incomingData = incomingData.filter(a => a.interestedTeam === userTeam);
                    }
                }
                setData(incomingData);
            })
            .catch((err) => console.error("Veri çekilemedi:", err));
    };

    useEffect(() => {
        resetForm();
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // GENEL KAYDETME FONKSİYONU
    const handleSubmit = async (e) => {
        e.preventDefault();
        let endpoint = "";
        let payload = {};

        // Hangi sekmedeyiz?
        if (activeTab === "events") {
            endpoint = "/api/events";
            const selectedTeam = userRole === "TeamLead" ? userTeam : (formData.team || "Yönetim Kurulu");
            payload = {
                title: formData.title, description: formData.description,
                eventDate: formData.date, location: formData.location,
                posterUrl: formData.posterUrl, organizerTeam: selectedTeam
            };
        } else if (activeTab === "members") {
            endpoint = "/api/members";
            const selectedTeam = userRole === "TeamLead" ? userTeam : (formData.team || "Yönetim Kurulu");
            payload = {
                name: formData.name, title: formData.titleMember,
                imageUrl: formData.imageUrl, team: selectedTeam
            };
        } else if (activeTab === "texts") {
            endpoint = "/api/sitetexts";
            payload = { value: formData.value }; // Site yazıları Key ile güncellenir
        } else if (activeTab === "teams") {
            endpoint = "/api/teams";
            payload = { name: formData.name };
        }

        try {
            if (editingItem) {
                // Güncelleme
                const id = editingItem.id || editingItem.key;
                // Site yazıları hariç diğerlerinde ID kullanıyoruz
                await axios.put(`${BASE_URL}${endpoint}/${id}`, payload);
            } else {
                // Yeni Ekleme
                await axios.post(`${BASE_URL}${endpoint}`, payload);
            }

            console.log("✅ İŞLEM BAŞARILI!");
            setModalOpen(false);
            setEditingItem(null);
            resetForm();
            fetchData(); // Tabloyu yenile
            if (activeTab === "teams") fetchTeams(); // Eğer takım eklendiyse dropdown'ı da yenile
        } catch (error) {
            console.error("❌ HATA:", error);
            alert("İşlem sırasında hata oluştu.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Silmek istediğine emin misin?")) return;

        let endpoint = "";
        if (activeTab === "events") endpoint = "/api/events";
        else if (activeTab === "members") endpoint = "/api/members";
        else if (activeTab === "texts") endpoint = "/api/sitetexts";
        else if (activeTab === "teams") endpoint = "/api/teams";

        try {
            await axios.delete(`${BASE_URL}${endpoint}/${id}`);
            fetchData();
            if (activeTab === "teams") fetchTeams(); // Takım silindiyse dropdown'ı güncelle
        } catch (error) { console.error("Silinemedi:", error); }
    };

    const updateAppStatus = async (id, status) => {
        try {
            await axios.put(`${BASE_URL}/api/applications/${id}/status`, `"${status}"`, {
                headers: { 'Content-Type': 'application/json' }
            });
            alert(`Başvuru ${status} olarak işaretlendi.`);
            fetchData();
        } catch (error) { console.error("Durum güncellenemedi", error); }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || "", description: item.description || "",
            date: item.eventDate ? item.eventDate.substring(0, 16) : "",
            location: item.location || "", posterUrl: item.posterUrl || "",
            name: item.name || "", imageUrl: item.imageUrl || "",
            titleMember: item.title || "", team: item.team || item.organizerTeam || "",
            key: item.key || "", value: item.value || ""
        });
        setModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: "", description: "", date: "", location: "", posterUrl: "",
            name: "", imageUrl: "", titleMember: "", team: "",
            key: "", value: ""
        });
    };

    const canManageItem = (item) => {
        if (userRole === "SuperAdmin") return true;
        if (activeTab === "events") {
            const itemTeam = item.organizerTeam ? item.organizerTeam.trim() : "";
            const myTeam = userTeam ? userTeam.trim() : "";
            return itemTeam === myTeam;
        }
        return activeTab === "members" || activeTab === "applications";
    };

    const TeamSelect = () => (
        <select
            name="team"
            value={formData.team}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
            required
        >
            <option value="">Bir Takım Seçiniz...</option>
            {teamsList.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
            ))}
        </select>
    );

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <div className="admin-logo">KTÜN Admin</div>
                <div className="admin-user-info">
                    <small>Giriş Yapan:</small><br />
                    <strong>{userRole === "SuperAdmin" ? "Genel Başkan" : userTeam}</strong>
                </div>
                <nav>
                    <button className={activeTab === "events" ? "active" : ""} onClick={() => setActiveTab("events")}>📅 Etkinlikler</button>
                    <button className={activeTab === "members" ? "active" : ""} onClick={() => setActiveTab("members")}>👥 Üyeler</button>
                    <button className={activeTab === "applications" ? "active" : ""} onClick={() => setActiveTab("applications")}>🚀 Başvurular</button>

                    {userRole === "SuperAdmin" && (
                        <>
                            <button className={activeTab === "teams" ? "active" : ""} onClick={() => setActiveTab("teams")}>🏢 Takımlar</button>
                            <button className={activeTab === "texts" ? "active" : ""} onClick={() => setActiveTab("texts")}>✍️ Site Yazıları</button>
                        </>
                    )}
                </nav>
                <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Çıkış Yap</button>
            </div>

            <div className="admin-content">
                <div className="admin-section">
                    <h2>
                        {activeTab === "events" && "Etkinlik Yönetimi"}
                        {activeTab === "members" && "Üye Yönetimi"}
                        {activeTab === "applications" && "Gelen Başvurular"}
                        {activeTab === "teams" && "Takım Yönetimi"}
                        {activeTab === "texts" && "Site Yazıları"}
                    </h2>

                    {activeTab !== "texts" && activeTab !== "applications" && (
                        <button className="add-btn" onClick={() => { setEditingItem(null); resetForm(); setModalOpen(true); }}>
                            + Yeni Ekle
                        </button>
                    )}

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                {activeTab === "events" && <><th>Afiş</th><th>Başlık</th><th>Düzenleyen</th></>}
                                {activeTab === "members" && <><th>Resim</th><th>İsim</th><th>Unvan</th><th>Takım</th></>}
                                {activeTab === "applications" && <><th>Ad Soyad</th><th>Takım</th><th>Durum</th><th>İşlemler</th></>}
                                {activeTab === "teams" && <><th>Takım Adı</th></>}
                                {activeTab === "texts" && <><th>Anahtar</th><th>Değer</th></>}
                                {activeTab !== "applications" && <th>İşlemler</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id || item.key}>
                                    <td>{item.id || "#"}</td>

                                    {/* --- EVENTS --- */}
                                    {activeTab === "events" && (
                                        <>
                                            <td>{item.posterUrl ? <img src={item.posterUrl} className="table-img" alt="" /> : "Yok"}</td>
                                            <td>{item.title}</td>
                                            <td><span className="badge-team">{item.organizerTeam || "Genel"}</span></td>
                                        </>
                                    )}

                                    {/* --- MEMBERS --- */}
                                    {activeTab === "members" && (
                                        <>
                                            <td><img src={item.imageUrl || ""} className="table-img" alt="" /></td>
                                            <td>{item.name}</td>
                                            <td>{item.title}</td>
                                            <td>{item.team}</td>
                                        </>
                                    )}

                                    {/* --- APPLICATIONS --- */}
                                    {activeTab === "applications" && (
                                        <>
                                            <td>{item.firstName} {item.lastName}</td>
                                            <td>{item.interestedTeam}</td>
                                            <td>
                                                <span style={{
                                                    padding: "5px 10px", borderRadius: "5px", color: "white", fontWeight: "bold",
                                                    backgroundColor: item.status === "Onaylandı" ? "#2ecc71" : item.status === "Reddedildi" ? "#e74c3c" : "#f1c40f"
                                                }}>{item.status}</span>
                                            </td>
                                            <td>
                                                <button className="edit-btn" style={{ marginRight: "5px", backgroundColor: "#2ecc71" }} onClick={() => updateAppStatus(item.id, "Onaylandı")}>✅</button>
                                                <button className="delete-btn" style={{ backgroundColor: "#e74c3c" }} onClick={() => updateAppStatus(item.id, "Reddedildi")}>❌</button>
                                            </td>
                                        </>
                                    )}

                                    {/* --- TEAMS --- */}
                                    {activeTab === "teams" && (
                                        <td><strong>{item.name}</strong></td>
                                    )}

                                    {/* --- TEXTS --- */}
                                    {activeTab === "texts" && (
                                        <>
                                            <td>{item.key}</td>
                                            <td>{item.value?.substring(0, 50)}...</td>
                                        </>
                                    )}

                                    {/* İŞLEMLER BUTONU */}
                                    {activeTab !== "applications" && (
                                        <td>
                                            {canManageItem(item) ? (
                                                <>
                                                    {activeTab !== "teams" && <button className="edit-btn" onClick={() => handleEdit(item)}>Düzenle</button>}
                                                    <button className="delete-btn" onClick={() => handleDelete(item.id)}>Sil</button>
                                                </>
                                            ) : <span style={{ fontSize: "0.8rem", color: "#999" }}>Yetkisiz</span>}
                                        </td>
                                    )}
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
                                    <textarea name="description" placeholder="Açıklama" value={formData.description} onChange={handleInputChange} required rows="3"></textarea>
                                    <input type="datetime-local" name="date" value={formData.date} onChange={handleInputChange} required />
                                    <input type="text" name="location" placeholder="Konum" value={formData.location} onChange={handleInputChange} required />
                                    <input type="text" name="posterUrl" placeholder="Afiş URL" value={formData.posterUrl} onChange={handleInputChange} />
                                    <label>Düzenleyen:</label>
                                    {userRole === "SuperAdmin" ? <TeamSelect /> : <input type="text" value={userTeam} disabled style={{ background: "#eee" }} />}
                                </>
                            )}

                            {activeTab === "members" && (
                                <>
                                    <input type="text" name="name" placeholder="Ad Soyad" value={formData.name} onChange={handleInputChange} required />
                                    <input type="text" name="titleMember" placeholder="Unvan" value={formData.titleMember} onChange={handleInputChange} required />
                                    <label>Takım:</label>
                                    {userRole === "SuperAdmin" ? <TeamSelect /> : <input type="text" value={userTeam} disabled style={{ background: "#eee" }} />}
                                    <input type="text" name="imageUrl" placeholder="Resim URL" value={formData.imageUrl} onChange={handleInputChange} />
                                </>
                            )}

                            {activeTab === "teams" && (
                                <>
                                    <label>Yeni Takım Adı:</label>
                                    <input type="text" name="name" placeholder="Örn: Yapay Zeka Ekibi" value={formData.name} onChange={handleInputChange} required />
                                </>
                            )}

                            {activeTab === "texts" && (
                                <>
                                    <input type="text" value={formData.key} disabled style={{ background: "#eee" }} />
                                    <textarea name="value" value={formData.value} onChange={handleInputChange} rows="5"></textarea>
                                </>
                            )}

                            <button type="submit" className="save-btn">{editingItem ? "Güncelle" : "Kaydet"}</button>
                            <button type="button" className="close-btn" onClick={() => setModalOpen(false)}>İptal</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;