/* ==========================================================================
   Script de l'espace administrateur — Régie Boyzz'er Institut
   Démonstration front-end : les données sont stockées dans le localStorage
   du navigateur. Pour une mise en production réelle, chaque fonction ci-
   dessous doit être remplacée par un appel à une API sécurisée connectée
   à une base de données (voir section 13 du cahier des charges et le
   README.md fourni avec le site).
   ========================================================================== */

/* ---------- Garde d'authentification (démo) ---------- */
if(sessionStorage.getItem("rbi_admin_connecte") !== "1"){
  window.location.href = "index.html";
}

document.getElementById("btn-deconnexion").addEventListener("click", (e) => {
  e.preventDefault();
  sessionStorage.removeItem("rbi_admin_connecte");
  window.location.href = "index.html";
});

document.getElementById("date-jour").textContent = new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

/* ---------- Navigation entre les vues ---------- */
const liensNav = document.querySelectorAll(".admin-nav a[data-vue]");
liensNav.forEach(lien => {
  lien.addEventListener("click", (e) => {
    e.preventDefault();
    liensNav.forEach(l => l.classList.remove("actif"));
    lien.classList.add("actif");
    document.querySelectorAll(".vue-admin").forEach(v => v.classList.remove("actif"));
    document.getElementById("vue-" + lien.dataset.vue).classList.add("actif");
    if(lien.dataset.vue === "tableau-de-bord") dessinerGraphiques();
  });
});

/* ---------- Utilitaires ---------- */
function formaterDate(iso){
  if(!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day:"numeric", month:"short", year:"numeric" });
}
function ouvrirModaleAdmin(html){
  document.getElementById("contenu-modale-admin").innerHTML = html;
  document.getElementById("modale-admin").classList.add("ouverte");
}
function fermerModaleAdmin(){
  document.getElementById("modale-admin").classList.remove("ouverte");
}
document.getElementById("modale-admin").addEventListener("click", (e) => {
  if(e.target.id === "modale-admin") fermerModaleAdmin();
});

/* =====================================================================
   TABLEAU DE BORD
   ===================================================================== */
function rendreTableauDeBord(){
  const inscriptions = RB.lire("inscriptions", []);
  const reservations = RB.lire("reservations", []);
  const actualites = RB.lire("actualites", ACTUALITES_DEFAUT);
  const visiteurs = RB.lire("stat_visiteurs", 3480 + inscriptions.length * 7);

  document.getElementById("stat-inscriptions").textContent = inscriptions.length;
  document.getElementById("stat-visiteurs").textContent = visiteurs;
  document.getElementById("stat-reservations").textContent = reservations.length;
  document.getElementById("stat-services-rendus").textContent = reservations.filter(r => r.statut === "rendu").length;
  document.getElementById("stat-actus").textContent = actualites.length;

  const tbody = document.getElementById("tbody-dernieres-inscriptions");
  tbody.innerHTML = inscriptions.slice(0,5).map(i => `
    <tr>
      <td>${i.numero}</td>
      <td>${i.nom || ""} ${i.prenom || ""}</td>
      <td>${nomFormation(i.formation)}</td>
      <td>${formaterDate(i.date)}</td>
      <td><span class="etat-tag ${i.statut === 'validé' ? 'etat-valide' : 'etat-attente'}">${i.statut}</span></td>
    </tr>`).join("") || `<tr><td colspan="5" style="color:var(--texte-doux);">Aucune inscription pour le moment.</td></tr>`;
}

function nomFormation(id){
  const f = RB.lire("formations", FORMATIONS_DEFAUT).find(x => x.id === id);
  return f ? f.nom : (id || "—");
}

let graphMensuel, graphFormations;
function dessinerGraphiques(){
  const inscriptions = RB.lire("inscriptions", []);
  const reservations = RB.lire("reservations", []);
  const mois = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  const compteInsc = new Array(12).fill(0);
  const compteRes = new Array(12).fill(0);
  inscriptions.forEach(i => { const m = new Date(i.date).getMonth(); if(!isNaN(m)) compteInsc[m]++; });
  reservations.forEach(r => { const m = new Date(r.date).getMonth(); if(!isNaN(m)) compteRes[m]++; });

  const ctx1 = document.getElementById("graphique-mensuel");
  if(ctx1){
    if(graphMensuel) graphMensuel.destroy();
    graphMensuel = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: mois,
        datasets: [
          { label:"Inscriptions", data: compteInsc, backgroundColor:"#b9924f" },
          { label:"Réservations", data: compteRes, backgroundColor:"#d9a0a7" }
        ]
      },
      options: { responsive:true, plugins:{ legend:{ position:"bottom" } }, scales:{ y:{ beginAtZero:true, ticks:{ precision:0 } } } }
    });
  }

  const formations = RB.lire("formations", FORMATIONS_DEFAUT);
  const repartition = formations.map(f => inscriptions.filter(i => i.formation === f.id).length);
  const ctx2 = document.getElementById("graphique-formations");
  if(ctx2){
    if(graphFormations) graphFormations.destroy();
    graphFormations = new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: formations.map(f => f.nom),
        datasets: [{ data: repartition, backgroundColor:["#b9924f","#d9a0a7","#8f6f34","#c98a97","#e4c583","#402a2e","#312622","#221a12","#4a2f34"] }]
      },
      options: { responsive:true, plugins:{ legend:{ position:"bottom", labels:{ boxWidth:10, font:{ size:10 } } } } }
    });
  }
}

/* =====================================================================
   INSCRIPTIONS
   ===================================================================== */
function rendreInscriptions(filtre){
  filtre = (filtre || "").toLowerCase();
  const inscriptions = RB.lire("inscriptions", []);
  const filtrees = inscriptions.filter(i =>
    !filtre ||
    (i.nom||"").toLowerCase().includes(filtre) ||
    (i.prenom||"").toLowerCase().includes(filtre) ||
    (i.numero||"").toLowerCase().includes(filtre)
  );
  const tbody = document.getElementById("tbody-inscriptions");
  tbody.innerHTML = filtrees.map((i, idx) => `
    <tr>
      <td>${i.numero}</td>
      <td>${i.nom || ""} ${i.prenom || ""}</td>
      <td>${i.telephone || "—"}</td>
      <td>${nomFormation(i.formation)}</td>
      <td>${i.session || "—"}</td>
      <td>${formaterDate(i.date)}</td>
      <td><span class="etat-tag ${i.statut === 'validé' ? 'etat-valide' : 'etat-attente'}">${i.statut}</span></td>
      <td class="actions-table">
        <button class="btn-icone" title="Voir" onclick="voirInscription('${i.numero}')">👁</button>
        <button class="btn-icone" title="Valider" onclick="validerInscription('${i.numero}')">✔</button>
        <button class="btn-icone" title="Supprimer" onclick="supprimerInscription('${i.numero}')">🗑</button>
      </td>
    </tr>`).join("") || `<tr><td colspan="8" style="color:var(--texte-doux);">Aucune inscription trouvée.</td></tr>`;
}
function voirInscription(numero){
  const i = RB.lire("inscriptions", []).find(x => x.numero === numero);
  if(!i) return;
  ouvrirModaleAdmin(`
    <button class="modale-fermer" onclick="fermerModaleAdmin()">✕</button>
    <span class="badge-dore">${i.statut}</span>
    <h2>${i.nom} ${i.prenom}</h2>
    <p><strong>Numéro :</strong> ${i.numero}</p>
    <p><strong>Sexe :</strong> ${i.sexe || "—"} — <strong>Naissance :</strong> ${i.date_naissance || "—"}</p>
    <p><strong>Téléphone :</strong> ${i.telephone || "—"} — <strong>WhatsApp :</strong> ${i.whatsapp || "—"}</p>
    <p><strong>Email :</strong> ${i.email || "—"}</p>
    <p><strong>Adresse :</strong> ${i.adresse || "—"}</p>
    <p><strong>Niveau scolaire :</strong> ${i.niveau_scolaire || "—"}</p>
    <p><strong>Formation :</strong> ${nomFormation(i.formation)} — <strong>Session :</strong> ${i.session || "—"}</p>
    <p><strong>Date d'inscription :</strong> ${formaterDate(i.date)}</p>
  `);
}
function validerInscription(numero){
  const liste = RB.lire("inscriptions", []);
  const item = liste.find(x => x.numero === numero);
  if(item) item.statut = "validé";
  RB.ecrire("inscriptions", liste);
  rendreInscriptions(document.getElementById("recherche-inscriptions").value);
  rendreTableauDeBord();
}
function supprimerInscription(numero){
  if(!confirm("Supprimer définitivement cette inscription ?")) return;
  RB.ecrire("inscriptions", RB.lire("inscriptions", []).filter(x => x.numero !== numero));
  rendreInscriptions(document.getElementById("recherche-inscriptions").value);
  rendreTableauDeBord();
}
document.getElementById("recherche-inscriptions").addEventListener("input", (e) => rendreInscriptions(e.target.value));
document.getElementById("btn-export-inscriptions").addEventListener("click", () => {
  const inscriptions = RB.lire("inscriptions", []);
  const fenetre = window.open("", "_blank");
  fenetre.document.write(`
    <html><head><title>Export inscriptions</title>
    <style>body{font-family:Arial;padding:24px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:6px 8px;font-size:12px;text-align:left;}</style>
    </head><body>
    <h2>Régie Boyzz'er Institut — Export des inscriptions</h2>
    <table><thead><tr><th>N°</th><th>Nom</th><th>Prénom</th><th>Téléphone</th><th>Formation</th><th>Session</th><th>Date</th><th>Statut</th></tr></thead>
    <tbody>${inscriptions.map(i => `<tr><td>${i.numero}</td><td>${i.nom||""}</td><td>${i.prenom||""}</td><td>${i.telephone||""}</td><td>${nomFormation(i.formation)}</td><td>${i.session||""}</td><td>${formaterDate(i.date)}</td><td>${i.statut}</td></tr>`).join("")}</tbody>
    </table>
    <script>window.print()<\/script>
    </body></html>`);
  fenetre.document.close();
});

/* =====================================================================
   FORMATIONS
   ===================================================================== */
function rendreFormationsAdmin(){
  const formations = RB.lire("formations", FORMATIONS_DEFAUT);
  document.getElementById("tbody-formations").innerHTML = formations.map(f => `
    <tr>
      <td>${f.nom}</td>
      <td>${f.duree}</td>
      <td>${f.niveau}</td>
      <td><span class="etat-tag ${f.actif === false ? 'etat-attente' : 'etat-valide'}">${f.actif === false ? 'Désactivée' : 'Active'}</span></td>
      <td class="actions-table">
        <button class="btn-icone" title="Modifier" onclick="editerFormation('${f.id}')">✎</button>
        <button class="btn-icone" title="Activer / Désactiver" onclick="basculerFormation('${f.id}')">⏻</button>
        <button class="btn-icone" title="Supprimer" onclick="supprimerFormation('${f.id}')">🗑</button>
      </td>
    </tr>`).join("");
}
function formulaireFormation(f){
  f = f || { id:"", nom:"", duree:"", niveau:"", resume:"", debouches:"", admission:"", degrade:"deg-1", programme:[] };
  return `
    <button class="modale-fermer" onclick="fermerModaleAdmin()">✕</button>
    <h2>${f.id ? "Modifier" : "Ajouter"} une formation</h2>
    <form id="form-admin-formation">
      <input type="hidden" name="id" value="${f.id}">
      <div class="champ"><label>Nom de la formation</label><input type="text" name="nom" value="${f.nom}" required></div>
      <div class="grille-champs">
        <div class="champ"><label>Durée</label><input type="text" name="duree" value="${f.duree}" placeholder="Ex : 3 mois" required></div>
        <div class="champ"><label>Niveau</label><input type="text" name="niveau" value="${f.niveau}" placeholder="Ex : Débutant" required></div>
      </div>
      <div class="champ"><label>Résumé</label><textarea name="resume" rows="2" required>${f.resume}</textarea></div>
      <div class="champ"><label>Programme (une ligne par point)</label><textarea name="programme" rows="4">${(f.programme||[]).join("\n")}</textarea></div>
      <div class="champ"><label>Débouchés</label><input type="text" name="debouches" value="${f.debouches}"></div>
      <div class="champ"><label>Conditions d'admission</label><input type="text" name="admission" value="${f.admission}"></div>
      <button class="btn btn-or btn-bloc" type="submit">Enregistrer</button>
    </form>`;
}
function editerFormation(id){
  const f = RB.lire("formations", FORMATIONS_DEFAUT).find(x => x.id === id);
  ouvrirModaleAdmin(formulaireFormation(f));
  attacherFormulaireFormation();
}
document.getElementById("btn-ajouter-formation").addEventListener("click", () => {
  ouvrirModaleAdmin(formulaireFormation());
  attacherFormulaireFormation();
});
function attacherFormulaireFormation(){
  document.getElementById("form-admin-formation").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const formations = RB.lire("formations", FORMATIONS_DEFAUT);
    data.programme = data.programme.split("\n").map(s => s.trim()).filter(Boolean);
    if(data.id){
      const idx = formations.findIndex(x => x.id === data.id);
      formations[idx] = { ...formations[idx], ...data };
    } else {
      data.id = data.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
      data.degrade = "deg-" + ((formations.length % 8) + 1);
      data.actif = true;
      formations.push(data);
    }
    RB.ecrire("formations", formations);
    fermerModaleAdmin();
    rendreFormationsAdmin();
  });
}
function basculerFormation(id){
  const formations = RB.lire("formations", FORMATIONS_DEFAUT);
  const f = formations.find(x => x.id === id);
  if(f) f.actif = f.actif === false ? true : false;
  RB.ecrire("formations", formations);
  rendreFormationsAdmin();
}
function supprimerFormation(id){
  if(!confirm("Supprimer définitivement cette formation ?")) return;
  RB.ecrire("formations", RB.lire("formations", FORMATIONS_DEFAUT).filter(x => x.id !== id));
  rendreFormationsAdmin();
}

/* =====================================================================
   RESERVATIONS
   ===================================================================== */
function rendreReservations(){
  const reservations = RB.lire("reservations", []);
  document.getElementById("stat-total-reservations").textContent = reservations.length;
  document.getElementById("stat-attente-reservations").textContent = reservations.filter(r => r.statut !== "rendu").length;
  document.getElementById("stat-rendus-reservations").textContent = reservations.filter(r => r.statut === "rendu").length;
  document.getElementById("tbody-reservations").innerHTML = reservations.map(r => `
    <tr>
      <td>${r.nom}</td>
      <td>${r.sexe || "—"}</td>
      <td>${(r.services||[]).join(", ")}</td>
      <td>${r.lieu}</td>
      <td>${r.telephone}</td>
      <td>${r.whatsapp || "—"}</td>
      <td><span class="etat-tag ${r.statut === 'rendu' ? 'etat-valide' : 'etat-attente'}">${r.statut === 'rendu' ? 'Rendu' : 'En attente'}</span></td>
      <td class="actions-table">
        <button class="btn-icone" title="Marquer comme rendu" onclick="marquerReservationRendue('${r.numero}')">✔</button>
        <button class="btn-icone" title="Supprimer" onclick="supprimerReservation('${r.numero}')">🗑</button>
      </td>
    </tr>`).join("") || `<tr><td colspan="8" style="color:var(--texte-doux);">Aucune réservation pour le moment.</td></tr>`;
}
function marquerReservationRendue(numero){
  const liste = RB.lire("reservations", []);
  const item = liste.find(x => x.numero === numero);
  if(item) item.statut = "rendu";
  RB.ecrire("reservations", liste);
  rendreReservations();
}
function supprimerReservation(numero){
  if(!confirm("Supprimer définitivement cette réservation ?")) return;
  RB.ecrire("reservations", RB.lire("reservations", []).filter(x => x.numero !== numero));
  rendreReservations();
}

/* =====================================================================
   ACTUALITES
   ===================================================================== */
function rendreActualitesAdmin(){
  const actus = RB.lire("actualites", ACTUALITES_DEFAUT);
  document.getElementById("tbody-actualites").innerHTML = actus.map(a => `
    <tr>
      <td>${a.titre}</td>
      <td>${formaterDate(a.date)}</td>
      <td>${(a.extrait||"").slice(0,60)}...</td>
      <td class="actions-table">
        <button class="btn-icone" title="Modifier" onclick="editerActu('${a.id}')">✎</button>
        <button class="btn-icone" title="Supprimer" onclick="supprimerActu('${a.id}')">🗑</button>
      </td>
    </tr>`).join("");
}
function formulaireActu(a){
  a = a || { id:"", titre:"", extrait:"", degrade:"deg-2" };
  return `
    <button class="modale-fermer" onclick="fermerModaleAdmin()">✕</button>
    <h2>${a.id ? "Modifier" : "Ajouter"} un article</h2>
    <form id="form-admin-actu">
      <input type="hidden" name="id" value="${a.id}">
      <div class="champ"><label>Titre</label><input type="text" name="titre" value="${a.titre}" required></div>
      <div class="champ"><label>Extrait / contenu</label><textarea name="extrait" rows="4" required>${a.extrait}</textarea></div>
      <button class="btn btn-or btn-bloc" type="submit">Publier</button>
    </form>`;
}
document.getElementById("btn-ajouter-actu").addEventListener("click", () => {
  ouvrirModaleAdmin(formulaireActu());
  attacherFormulaireActu();
});
function editerActu(id){
  const a = RB.lire("actualites", ACTUALITES_DEFAUT).find(x => x.id === id);
  ouvrirModaleAdmin(formulaireActu(a));
  attacherFormulaireActu();
}
function attacherFormulaireActu(){
  document.getElementById("form-admin-actu").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const actus = RB.lire("actualites", ACTUALITES_DEFAUT);
    if(data.id){
      const idx = actus.findIndex(x => x.id === data.id);
      actus[idx] = { ...actus[idx], ...data };
    } else {
      data.id = "a" + Date.now();
      data.date = new Date().toISOString();
      data.degrade = "deg-" + ((actus.length % 8) + 1);
      actus.unshift(data);
    }
    RB.ecrire("actualites", actus);
    fermerModaleAdmin();
    rendreActualitesAdmin();
  });
}
function supprimerActu(id){
  if(!confirm("Supprimer cet article ?")) return;
  RB.ecrire("actualites", RB.lire("actualites", ACTUALITES_DEFAUT).filter(x => x.id !== id));
  rendreActualitesAdmin();
}

/* =====================================================================
   GALERIE
   ===================================================================== */
function rendreGalerieAdmin(){
  const galerie = RB.lire("galerie", GALERIE_DEFAUT);
  document.getElementById("tbody-galerie").innerHTML = galerie.map(g => `
    <tr>
      <td><div style="width:50px;height:50px;border-radius:6px;" class="${g.degrade}"></div></td>
      <td>${g.titre}</td>
      <td>${g.categorie}</td>
      <td class="actions-table">
        <button class="btn-icone" title="Modifier" onclick="editerImage('${g.id}')">✎</button>
        <button class="btn-icone" title="Supprimer" onclick="supprimerImage('${g.id}')">🗑</button>
      </td>
    </tr>`).join("");
}
function formulaireImage(g){
  g = g || { id:"", titre:"", categorie:"ateliers", degrade:"deg-1" };
  return `
    <button class="modale-fermer" onclick="fermerModaleAdmin()">✕</button>
    <h2>${g.id ? "Modifier" : "Ajouter"} une image</h2>
    <form id="form-admin-image">
      <input type="hidden" name="id" value="${g.id}">
      <div class="champ"><label>Titre / légende</label><input type="text" name="titre" value="${g.titre}" required></div>
      <div class="champ">
        <label>Album / catégorie</label>
        <select name="categorie" required>
          <option value="salle" ${g.categorie==='salle'?'selected':''}>Salle de formation</option>
          <option value="etudiants" ${g.categorie==='etudiants'?'selected':''}>Étudiants</option>
          <option value="avant-apres" ${g.categorie==='avant-apres'?'selected':''}>Avant / Après</option>
          <option value="diplomes" ${g.categorie==='diplomes'?'selected':''}>Diplômés</option>
          <option value="ateliers" ${g.categorie==='ateliers'?'selected':''}>Ateliers</option>
        </select>
      </div>
      <div class="champ"><label>Photo</label><input type="file" name="fichier" accept="image/*"><span class="aide">Démonstration : la couleur de la vignette est générée automatiquement.</span></div>
      <button class="btn btn-or btn-bloc" type="submit">Enregistrer</button>
    </form>`;
}
document.getElementById("btn-ajouter-image").addEventListener("click", () => {
  ouvrirModaleAdmin(formulaireImage());
  attacherFormulaireImage();
});
function editerImage(id){
  const g = RB.lire("galerie", GALERIE_DEFAUT).find(x => x.id === id);
  ouvrirModaleAdmin(formulaireImage(g));
  attacherFormulaireImage();
}
function attacherFormulaireImage(){
  document.getElementById("form-admin-image").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    delete data.fichier;
    const galerie = RB.lire("galerie", GALERIE_DEFAUT);
    if(data.id){
      const idx = galerie.findIndex(x => x.id === data.id);
      galerie[idx] = { ...galerie[idx], ...data };
    } else {
      data.id = "g" + Date.now();
      data.degrade = "deg-" + ((galerie.length % 8) + 1);
      galerie.unshift(data);
    }
    RB.ecrire("galerie", galerie);
    fermerModaleAdmin();
    rendreGalerieAdmin();
  });
}
function supprimerImage(id){
  if(!confirm("Supprimer cette image ?")) return;
  RB.ecrire("galerie", RB.lire("galerie", GALERIE_DEFAUT).filter(x => x.id !== id));
  rendreGalerieAdmin();
}

/* =====================================================================
   TEMOIGNAGES
   ===================================================================== */
function rendreTemoignagesAdmin(){
  const attente = RB.lire("temoignages_attente", []);
  const publies = RB.lire("temoignages", TEMOIGNAGES_DEFAUT);
  document.getElementById("tbody-temoignages-attente").innerHTML = attente.map(t => `
    <tr>
      <td>${t.nom}</td><td>${t.formation}</td><td>${(t.avis||"").slice(0,80)}</td>
      <td class="actions-table">
        <button class="btn-icone" title="Valider" onclick="validerTemoignage('${t.id}')">✔</button>
        <button class="btn-icone" title="Supprimer" onclick="supprimerTemoignageAttente('${t.id}')">🗑</button>
      </td>
    </tr>`).join("") || `<tr><td colspan="4" style="color:var(--texte-doux);">Aucun témoignage en attente.</td></tr>`;
  document.getElementById("tbody-temoignages-publies").innerHTML = publies.map(t => `
    <tr>
      <td>${t.nom}</td><td>${t.formation}</td><td>${(t.avis||"").slice(0,80)}</td>
      <td class="actions-table">
        <button class="btn-icone" title="Supprimer" onclick="supprimerTemoignagePublie('${t.id}')">🗑</button>
      </td>
    </tr>`).join("");
}
function validerTemoignage(id){
  const attente = RB.lire("temoignages_attente", []);
  const item = attente.find(x => x.id === id);
  if(item){
    RB.ajouter("temoignages", item);
    RB.ecrire("temoignages_attente", attente.filter(x => x.id !== id));
  }
  rendreTemoignagesAdmin();
}
function supprimerTemoignageAttente(id){
  RB.ecrire("temoignages_attente", RB.lire("temoignages_attente", []).filter(x => x.id !== id));
  rendreTemoignagesAdmin();
}
function supprimerTemoignagePublie(id){
  if(!confirm("Supprimer ce témoignage publié ?")) return;
  RB.ecrire("temoignages", RB.lire("temoignages", TEMOIGNAGES_DEFAUT).filter(x => x.id !== id));
  rendreTemoignagesAdmin();
}

/* =====================================================================
   MESSAGES & NEWSLETTER
   ===================================================================== */
function rendreMessages(){
  const messages = RB.lire("messages", []);
  document.getElementById("tbody-messages").innerHTML = messages.map(m => `
    <tr><td>${m.nom}</td><td>${m.telephone||"—"}</td><td>${m.sujet||"—"}</td><td>${(m.message||"").slice(0,60)}</td><td>${formaterDate(m.date)}</td></tr>
  `).join("") || `<tr><td colspan="5" style="color:var(--texte-doux);">Aucun message reçu.</td></tr>`;

  const newsletter = RB.lire("newsletter", []);
  document.getElementById("tbody-newsletter").innerHTML = newsletter.map(n => `
    <tr><td>${n.email}</td><td>${formaterDate(n.date)}</td></tr>
  `).join("") || `<tr><td colspan="2" style="color:var(--texte-doux);">Aucun abonné pour le moment.</td></tr>`;
}

/* ---------- Rendu initial de toutes les vues ---------- */
rendreTableauDeBord();
dessinerGraphiques();
rendreInscriptions("");
rendreFormationsAdmin();
rendreReservations();
rendreActualitesAdmin();
rendreGalerieAdmin();
rendreTemoignagesAdmin();
rendreMessages();
