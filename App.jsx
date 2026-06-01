import { useState } from "react";

const initialToilettes = [
  {
    id: 1,
    nom: "Toilettes Jardin du Palais Royal",
    adresse: "Place du Palais Royal, Paris 1er",
    gratuit: true,
    avis: [
      { auteur: "Marie", note: 4, commentaire: "Propres le matin, moins le soir.", date: "2026-05-10" },
      { auteur: "Julien", note: 3, commentaire: "Correct mais papier souvent manquant.", date: "2026-05-20" },
    ],
  },
  {
    id: 2,
    nom: "Sanisette Boulevard Haussmann",
    adresse: "Bd Haussmann, Paris 9ème",
    gratuit: true,
    avis: [
      { auteur: "Sophie", note: 5, commentaire: "Automatique, toujours propre !", date: "2026-05-15" },
    ],
  },
  {
    id: 3,
    nom: "WC Café de Flore",
    adresse: "172 Bd Saint-Germain, Paris 6ème",
    gratuit: false,
    avis: [
      { auteur: "Thomas", note: 5, commentaire: "Impeccable, mais faut consommer.", date: "2026-05-22" },
      { auteur: "Léa", note: 4, commentaire: "Très bien mais accès clients seulement.", date: "2026-05-28" },
    ],
  },
];

const StarRating = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {[1,2,3,4,5].map((s) => (
      <span key={s} onClick={() => onChange && onChange(s)} style={{
        fontSize: 18, cursor: onChange ? "pointer" : "default",
        color: s <= value ? "#e8789a" : "#f9c8d8", transition: "color 0.15s",
      }}>★</span>
    ))}
  </div>
);

const moyenne = (avis) => {
  if (!avis.length) return 0;
  return (avis.reduce((a, b) => a + b.note, 0) / avis.length).toFixed(1);
};

export default function App() {
  const [toilettes, setToilettes] = useState(initialToilettes);
  const [vue, setVue] = useState("liste");
  const [selected, setSelected] = useState(null);
  const [filtre, setFiltre] = useState("tous");
  const [search, setSearch] = useState("");
  const [newAvis, setNewAvis] = useState({ auteur: "", note: 0, commentaire: "" });
  const [newLieu, setNewLieu] = useState({ nom: "", adresse: "", gratuit: true });
  const [avisOk, setAvisOk] = useState(false);
  const [lieuOk, setLieuOk] = useState(false);

  const filtered = toilettes.filter((t) => {
    const mf = filtre === "tous" || (filtre === "gratuit" ? t.gratuit : !t.gratuit);
    const ms = t.nom.toLowerCase().includes(search.toLowerCase()) || t.adresse.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const submitAvis = () => {
    if (!newAvis.auteur || !newAvis.note || !newAvis.commentaire) return;
    const updated = { ...selected, avis: [...selected.avis, { ...newAvis, date: new Date().toISOString().slice(0,10) }] };
    setToilettes(toilettes.map(t => t.id === selected.id ? updated : t));
    setSelected(updated);
    setNewAvis({ auteur: "", note: 0, commentaire: "" });
    setAvisOk(true); setTimeout(() => setAvisOk(false), 2500);
  };

  const submitLieu = () => {
    if (!newLieu.nom || !newLieu.adresse) return;
    setToilettes([...toilettes, { id: Date.now(), ...newLieu, avis: [] }]);
    setNewLieu({ nom: "", adresse: "", gratuit: true });
    setLieuOk(true); setTimeout(() => { setLieuOk(false); setVue("liste"); }, 2000);
  };

  const s = {
    app: {
      minHeight: "100vh",
      background: "#fff5f7",
      color: "#3d1a26",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      maxWidth: 430,
      margin: "0 auto",
    },
    header: {
      background: "linear-gradient(135deg, #f472a8 0%, #e8789a 50%, #d95f87 100%)",
      padding: "28px 20px 20px",
      position: "relative",
      overflow: "hidden",
    },
    headerBg: {
      position: "absolute", top: -20, right: -20,
      width: 140, height: 140,
      background: "rgba(255,255,255,0.1)",
      borderRadius: "50%",
    },
    headerBg2: {
      position: "absolute", bottom: -30, left: -10,
      width: 100, height: 100,
      background: "rgba(255,255,255,0.07)",
      borderRadius: "50%",
    },
    logoRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16, position: "relative" },
    logoCircle: {
      width: 48, height: 48, borderRadius: 24,
      background: "rgba(255,255,255,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 24,
    },
    logoTitle: { fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.1 },
    logoSub: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontStyle: "italic", marginTop: 2 },
    searchBox: {
      display: "flex", alignItems: "center", gap: 8,
      background: "rgba(255,255,255,0.9)",
      borderRadius: 24, padding: "10px 16px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      position: "relative",
    },
    searchInput: {
      background: "none", border: "none", outline: "none",
      color: "#3d1a26", fontSize: 14, flex: 1,
    },
    filters: {
      display: "flex", gap: 8, padding: "14px 16px",
      background: "#fff",
      borderBottom: "1px solid #fde8ef",
    },
    fBtn: (a) => ({
      padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
      border: a ? "none" : "1.5px solid #f9c8d8",
      background: a ? "linear-gradient(135deg, #f472a8, #e8789a)" : "transparent",
      color: a ? "#fff" : "#e8789a", cursor: "pointer", transition: "all 0.15s",
    }),
    list: { padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 },
    card: {
      background: "#fff", borderRadius: 18, padding: "16px",
      cursor: "pointer", border: "1.5px solid #fde8ef",
      boxShadow: "0 2px 12px rgba(232,120,154,0.08)",
      transition: "transform 0.15s, box-shadow 0.15s",
    },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
    cardNom: { fontSize: 15, fontWeight: 700, color: "#3d1a26", flex: 1, marginRight: 8, lineHeight: 1.3 },
    badge: (g) => ({
      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
      background: g ? "#dcfce7" : "#fff3e0",
      color: g ? "#15803d" : "#c2410c", whiteSpace: "nowrap",
    }),
    cardAddr: { fontSize: 12, color: "#b07090", marginBottom: 10 },
    cardBottom: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    noteText: { fontSize: 12, color: "#b07090" },

    // detail
    detail: { paddingBottom: 80 },
    detailHero: {
      background: "linear-gradient(135deg, #f472a8 0%, #d95f87 100%)",
      padding: "20px 20px 28px",
    },
    backBtn: {
      display: "flex", alignItems: "center", gap: 6,
      color: "rgba(255,255,255,0.85)", fontSize: 14, cursor: "pointer",
      background: "none", border: "none", marginBottom: 14, fontFamily: "inherit",
    },
    detailNom: { fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.3px" },
    detailAddr: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 14 },
    detailMeta: { display: "flex", gap: 10, alignItems: "center" },
    section: { padding: "20px 20px 0" },
    secTitle: {
      fontSize: 11, fontWeight: 700, color: "#e8789a",
      textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14,
    },
    avisCard: {
      background: "#fff", borderRadius: 14, padding: "14px",
      marginBottom: 10, border: "1.5px solid #fde8ef",
    },
    avisTop: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
    avisAuteur: { fontWeight: 700, fontSize: 14, color: "#3d1a26" },
    avisDate: { fontSize: 11, color: "#c49aad" },
    avisTxt: { fontSize: 13, color: "#7a3a52", lineHeight: 1.55, marginTop: 6 },
    formSec: { padding: "20px" },
    input: {
      width: "100%", background: "#fff",
      border: "1.5px solid #fde8ef", borderRadius: 12,
      padding: "12px 14px", color: "#3d1a26", fontSize: 14,
      outline: "none", marginBottom: 10, boxSizing: "border-box",
      fontFamily: "inherit",
    },
    textarea: {
      width: "100%", background: "#fff",
      border: "1.5px solid #fde8ef", borderRadius: 12,
      padding: "12px 14px", color: "#3d1a26", fontSize: 14,
      outline: "none", marginBottom: 10, resize: "none", height: 80,
      boxSizing: "border-box", fontFamily: "inherit",
    },
    btn: {
      width: "100%", padding: "14px", borderRadius: 24,
      background: "linear-gradient(135deg, #f472a8, #d95f87)",
      color: "#fff", fontSize: 15, fontWeight: 700,
      border: "none", cursor: "pointer", fontFamily: "inherit",
      boxShadow: "0 4px 16px rgba(232,120,154,0.35)",
    },
    success: {
      background: "#dcfce7", border: "1.5px solid #86efac",
      color: "#15803d", borderRadius: 12, padding: "12px",
      textAlign: "center", fontSize: 14, marginBottom: 12, fontWeight: 600,
    },
    fab: {
      position: "fixed", bottom: 24, right: "calc(50% - 215px + 16px)",
      width: 56, height: 56, borderRadius: 28,
      background: "linear-gradient(135deg, #f472a8, #d95f87)",
      color: "#fff", fontSize: 28, border: "none", cursor: "pointer",
      boxShadow: "0 4px 20px rgba(232,120,154,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    },
    toggle: { display: "flex", gap: 8, marginBottom: 12 },
    tBtn: (a) => ({
      flex: 1, padding: "10px", borderRadius: 12,
      border: a ? "2px solid #e8789a" : "1.5px solid #fde8ef",
      background: a ? "#fff0f5" : "#fff",
      color: a ? "#e8789a" : "#b07090",
      fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
    }),
    emptyState: { textAlign: "center", padding: "60px 20px", color: "#c49aad" },
    statsBar: {
      display: "flex", gap: 0,
      background: "#fff", borderBottom: "1px solid #fde8ef",
      padding: "10px 16px",
    },
    stat: { flex: 1, textAlign: "center" },
    statNum: { fontSize: 18, fontWeight: 700, color: "#e8789a" },
    statLbl: { fontSize: 10, color: "#b07090", textTransform: "uppercase", letterSpacing: 0.5 },
  };

  const gratuitCount = toilettes.filter(t => t.gratuit).length;
  const totalAvis = toilettes.reduce((a, t) => a + t.avis.length, 0);

  return (
    <div style={s.app}>

      {/* LISTE */}
      {vue === "liste" && <>
        <div style={s.header}>
          <div style={s.headerBg} /><div style={s.headerBg2} />
          <div style={s.logoRow}>
            <div style={s.logoCircle}>🌸</div>
            <div>
              <div style={s.logoTitle}>Envie Urgente</div>
              <div style={s.logoSub}>Trouvez les toilettes en un clin d'œil</div>
            </div>
          </div>
          <div style={s.searchBox}>
            <span style={{ color: "#e8789a" }}>🔍</span>
            <input style={s.searchInput} placeholder="Rechercher un lieu ou une adresse..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div style={s.statsBar}>
          <div style={s.stat}><div style={s.statNum}>{toilettes.length}</div><div style={s.statLbl}>Lieux</div></div>
          <div style={{ width: 1, background: "#fde8ef" }} />
          <div style={s.stat}><div style={s.statNum}>{gratuitCount}</div><div style={s.statLbl}>Gratuits</div></div>
          <div style={{ width: 1, background: "#fde8ef" }} />
          <div style={s.stat}><div style={s.statNum}>{totalAvis}</div><div style={s.statLbl}>Avis</div></div>
        </div>

        <div style={s.filters}>
          {["tous","gratuit","payant"].map(f => (
            <button key={f} style={s.fBtn(filtre===f)} onClick={() => setFiltre(f)}>
              {f==="tous" ? "Tous" : f==="gratuit" ? "✅ Gratuit" : "💶 Payant"}
            </button>
          ))}
        </div>

        <div style={s.list}>
          {filtered.length === 0
            ? <div style={s.emptyState}><div style={{fontSize:48,marginBottom:12}}>🌸</div><div>Aucun résultat…</div></div>
            : filtered.map(t => (
              <div key={t.id} style={s.card} onClick={() => { setSelected(t); setVue("detail"); }}>
                <div style={s.cardTop}>
                  <div style={s.cardNom}>{t.nom}</div>
                  <span style={s.badge(t.gratuit)}>{t.gratuit ? "Gratuit" : "Payant"}</span>
                </div>
                <div style={s.cardAddr}>📍 {t.adresse}</div>
                <div style={s.cardBottom}>
                  <StarRating value={Math.round(moyenne(t.avis))} />
                  <span style={s.noteText}>
                    {moyenne(t.avis) > 0 ? `${moyenne(t.avis)} · ${t.avis.length} avis` : "Pas encore d'avis"}
                  </span>
                </div>
              </div>
            ))
          }
        </div>
        <button style={s.fab} onClick={() => setVue("ajouter")}>+</button>
      </>}

      {/* DETAIL */}
      {vue === "detail" && selected && (
        <div style={s.detail}>
          <div style={s.detailHero}>
            <button style={s.backBtn} onClick={() => setVue("liste")}>← Retour</button>
            <div style={s.detailNom}>{selected.nom}</div>
            <div style={s.detailAddr}>📍 {selected.adresse}</div>
            <div style={s.detailMeta}>
              <span style={s.badge(selected.gratuit)}>{selected.gratuit ? "Gratuit" : "Payant"}</span>
              <StarRating value={Math.round(moyenne(selected.avis))} />
              {moyenne(selected.avis) > 0 && <span style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>{moyenne(selected.avis)}/5</span>}
            </div>
          </div>

          <div style={s.section}>
            <div style={s.secTitle}>Avis ({selected.avis.length})</div>
            {selected.avis.length === 0 && <p style={{color:"#c49aad",fontSize:13}}>Aucun avis pour l'instant — soyez la première !</p>}
            {selected.avis.map((a, i) => (
              <div key={i} style={s.avisCard}>
                <div style={s.avisTop}>
                  <span style={s.avisAuteur}>{a.auteur}</span>
                  <span style={s.avisDate}>{a.date}</span>
                </div>
                <StarRating value={a.note} />
                <p style={s.avisTxt}>{a.commentaire}</p>
              </div>
            ))}
          </div>

          <div style={s.formSec}>
            <div style={s.secTitle}>Laisser un avis</div>
            {avisOk && <div style={s.success}>✨ Merci pour votre avis !</div>}
            <input style={s.input} placeholder="Votre prénom" value={newAvis.auteur}
              onChange={e => setNewAvis({...newAvis, auteur: e.target.value})} />
            <div style={{marginBottom:10}}>
              <StarRating value={newAvis.note} onChange={n => setNewAvis({...newAvis, note: n})} />
            </div>
            <textarea style={s.textarea} placeholder="Votre commentaire..." value={newAvis.commentaire}
              onChange={e => setNewAvis({...newAvis, commentaire: e.target.value})} />
            <button style={s.btn} onClick={submitAvis}>Publier mon avis 🌸</button>
          </div>
        </div>
      )}

      {/* AJOUTER */}
      {vue === "ajouter" && (
        <div style={{paddingBottom:40}}>
          <div style={s.detailHero}>
            <button style={s.backBtn} onClick={() => setVue("liste")}>← Retour</button>
            <div style={s.detailNom}>Ajouter un lieu</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>Aidez la communauté 💕</div>
          </div>
          <div style={s.formSec}>
            {lieuOk && <div style={s.success}>✨ Lieu ajouté, merci !</div>}
            <input style={s.input} placeholder="Nom du lieu (ex: Jardin des Tuileries)"
              value={newLieu.nom} onChange={e => setNewLieu({...newLieu, nom: e.target.value})} />
            <input style={s.input} placeholder="Adresse complète"
              value={newLieu.adresse} onChange={e => setNewLieu({...newLieu, adresse: e.target.value})} />
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,color:"#b07090",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Tarif</div>
              <div style={s.toggle}>
                <button style={s.tBtn(newLieu.gratuit)} onClick={() => setNewLieu({...newLieu, gratuit: true})}>✅ Gratuit</button>
                <button style={s.tBtn(!newLieu.gratuit)} onClick={() => setNewLieu({...newLieu, gratuit: false})}>💶 Payant</button>
              </div>
            </div>
            <button style={s.btn} onClick={submitLieu}>Ajouter ce lieu 🌸</button>
          </div>
        </div>
      )}

    </div>
  );
}
