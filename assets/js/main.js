/* ==========================================================================
   Script principal — Régie Boyzz'er Institut
   ========================================================================== */

/* ---------- Stockage local (démo front-end) ----------
   Dans une mise en production réelle, ces fonctions doivent être remplacées
   par des appels API vers le backend (voir section 13 du cahier des charges :
   Laravel ou Node.js + MySQL). Elles simulent ici une base de données afin
   que l'espace administrateur soit démontrable sans serveur. */
const RB = {
  cle(nom){ return "rbi_" + nom; },
  lire(nom, defaut){
    try{
      const brut = localStorage.getItem(this.cle(nom));
      if(!brut) { this.ecrire(nom, defaut); return defaut; }
      return JSON.parse(brut);
    }catch(e){ return defaut; }
  },
  ecrire(nom, valeur){
    try{ localStorage.setItem(this.cle(nom), JSON.stringify(valeur)); }catch(e){}
  },
  ajouter(nom, item){
    const liste = this.lire(nom, []);
    liste.unshift(item);
    this.ecrire(nom, liste);
    return liste;
  },
  genererNumero(prefixe){
    const compteur = this.lire("compteur_" + prefixe, 1000) + 1;
    this.ecrire("compteur_" + prefixe, compteur);
    return prefixe + "-" + compteur;
  }
};

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Header dynamique au scroll ---------- */
  const entete = document.querySelector(".entete");
  if(entete){
    const bascule = () => {
      if(window.scrollY > 40) entete.classList.add("solide");
      else entete.classList.remove("solide");
    };
    bascule();
    window.addEventListener("scroll", bascule, { passive:true });
  }

  /* ---------- Menu mobile ---------- */
  const burger = document.querySelector(".burger");
  const menuMobile = document.querySelector(".menu-mobile");
  if(burger && menuMobile){
    burger.addEventListener("click", () => menuMobile.classList.add("ouvert"));
    menuMobile.querySelectorAll("a, .fermer").forEach(el =>
      el.addEventListener("click", () => menuMobile.classList.remove("ouvert"))
    );
  }

  /* ---------- Révélation au scroll ---------- */
  const elements = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && elements.length){
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach(entree => {
        if(entree.isIntersecting){
          entree.target.classList.add("visible");
          observateur.unobserve(entree.target);
        }
      });
    }, { threshold:.15 });
    elements.forEach(el => observateur.observe(el));
  } else {
    elements.forEach(el => el.classList.add("visible"));
  }

  /* ---------- Slider du hero ---------- */
  const diapos = document.querySelectorAll(".hero-slide");
  const puces = document.querySelectorAll(".hero-dots button");
  if(diapos.length){
    let index = 0;
    const aller = (i) => {
      diapos[index].classList.remove("actif");
      puces[index] && puces[index].classList.remove("actif");
      index = i % diapos.length;
      diapos[index].classList.add("actif");
      puces[index] && puces[index].classList.add("actif");
    };
    puces.forEach((p, i) => p.addEventListener("click", () => aller(i)));
    setInterval(() => aller(index + 1), 5500);
  }

  /* ---------- Accordéon FAQ ---------- */
  document.querySelectorAll(".accordeon-tete").forEach(tete => {
    tete.addEventListener("click", () => {
      const item = tete.closest(".accordeon-item");
      const corps = item.querySelector(".accordeon-corps");
      const ouvert = item.classList.contains("ouvert");
      item.parentElement.querySelectorAll(".accordeon-item").forEach(i => {
        i.classList.remove("ouvert");
        i.querySelector(".accordeon-corps").style.maxHeight = null;
      });
      if(!ouvert){
        item.classList.add("ouvert");
        corps.style.maxHeight = corps.scrollHeight + "px";
      }
    });
  });

  /* ---------- Filtres galerie ---------- */
  const filtres = document.querySelectorAll(".filtre-btn");
  const itemsGalerie = document.querySelectorAll(".item-galerie");
  filtres.forEach(btn => {
    btn.addEventListener("click", () => {
      filtres.forEach(b => b.classList.remove("actif"));
      btn.classList.add("actif");
      const cat = btn.dataset.filtre;
      itemsGalerie.forEach(item => {
        item.style.display = (cat === "tous" || item.dataset.categorie === cat) ? "flex" : "none";
      });
    });
  });

  /* ---------- Cases de services (réservation) ---------- */
  document.querySelectorAll(".case-service input").forEach(cb => {
    cb.addEventListener("change", () => {
      cb.closest(".case-service").classList.toggle("actif", cb.checked);
    });
  });

  /* ---------- Newsletter ---------- */
  const formNl = document.querySelector(".newsletter-form");
  if(formNl){
    formNl.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = formNl.querySelector("input");
      if(input.value.trim()){
        RB.ajouter("newsletter", { email:input.value.trim(), date:new Date().toISOString() });
        input.value = "Merci, à bientôt !";
        input.disabled = true;
      }
    });
  }

  /* ---------- Formulaire d'inscription ---------- */
  const formInscription = document.getElementById("form-inscription");
  if(formInscription){
    formInscription.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formInscription).entries());
      const numero = RB.genererNumero("INS");
      const enregistrement = { ...data, numero, statut:"en attente", date:new Date().toISOString() };
      RB.ajouter("inscriptions", enregistrement);
      formInscription.reset();
      formInscription.style.display = "none";
      const confirmation = document.getElementById("confirmation-inscription");
      confirmation.style.display = "block";
      confirmation.querySelector(".recap-numero strong").textContent = numero;
    });
  }

  /* ---------- Formulaire de réservation ---------- */
  const formReservation = document.getElementById("form-reservation");
  if(formReservation){
    formReservation.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(formReservation);
      const services = data.getAll("services");
      if(services.length === 0){
        alert("Veuillez sélectionner au moins un service.");
        return;
      }
      const enregistrement = {
        nom: data.get("nom"),
        sexe: data.get("sexe"),
        services,
        lieu: data.get("lieu"),
        telephone: data.get("telephone"),
        whatsapp: data.get("whatsapp"),
        statut: "en attente",
        date: new Date().toISOString(),
        numero: RB.genererNumero("RES")
      };
      RB.ajouter("reservations", enregistrement);
      formReservation.reset();
      document.querySelectorAll(".case-service").forEach(c => c.classList.remove("actif"));
      formReservation.style.display = "none";
      document.getElementById("confirmation-reservation").style.display = "block";
    });
  }

  /* ---------- Formulaire de contact ---------- */
  const formContact = document.getElementById("form-contact");
  if(formContact){
    formContact.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formContact).entries());
      RB.ajouter("messages", { ...data, date:new Date().toISOString() });
      formContact.reset();
      const msgC = document.getElementById("confirmation-contact");
      msgC.classList.add("succes");
      msgC.style.display = "block";
    });
  }

  /* ---------- Formulaire de témoignage ---------- */
  const formTemoignage = document.getElementById("form-temoignage");
  if(formTemoignage){
    formTemoignage.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formTemoignage).entries());
      RB.ajouter("temoignages_attente", { ...data, id:"t"+Date.now(), date:new Date().toISOString() });
      formTemoignage.reset();
      const msg = document.getElementById("confirmation-temoignage");
      msg.classList.add("succes");
      msg.style.display = "block";
      formTemoignage.style.display = "none";
    });
  }
});

/* ---------- Rendu dynamique : formations (page formations.html) ---------- */
function rendreFormations(conteneurId){
  const conteneur = document.getElementById(conteneurId);
  if(!conteneur) return;
  const formations = RB.lire("formations", FORMATIONS_DEFAUT);
  conteneur.innerHTML = formations.map(f => `
    <article class="carte-formation reveal">
      <div class="visuel ${f.degrade}"><span class="tag">${f.duree}</span>✂</div>
      <div class="corps">
        <h3>${f.nom}</h3>
        <div class="meta">
          <span>⏱ ${f.duree}</span>
          <span>◆ ${f.niveau}</span>
        </div>
        <p>${f.resume}</p>
        <div class="bas">
          <button class="lien-fleche" onclick="ouvrirFormation('${f.id}')">Voir la fiche
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </article>
  `).join("");
  reobserverReveal();
}

function ouvrirFormation(id){
  const formations = RB.lire("formations", FORMATIONS_DEFAUT);
  const f = formations.find(x => x.id === id);
  if(!f) return;
  const modaleFond = document.getElementById("modale-formation");
  modaleFond.innerHTML = `
    <div class="modale">
      <button class="modale-fermer" onclick="fermerModale('modale-formation')">✕</button>
      <div class="visuel-modale ${f.degrade}">✂</div>
      <span class="badge-dore">${f.niveau}</span>
      <h2>${f.nom}</h2>
      <div class="fiche-meta">
        <div><strong>${f.duree}</strong><span>Durée</span></div>
        <div><strong>${f.niveau}</strong><span>Niveau</span></div>
      </div>
      <p>${f.resume}</p>
      <h3 style="font-size:1rem;margin-top:1.4rem;">Programme</h3>
      <ul class="programme">${f.programme.map(p => `<li>${p}</li>`).join("")}</ul>
      <h3 style="font-size:1rem;margin-top:1.4rem;">Débouchés</h3>
      <p>${f.debouches}</p>
      <h3 style="font-size:1rem;margin-top:1.4rem;">Conditions d'admission</h3>
      <p>${f.admission}</p>
      <a href="inscription.html?formation=${f.id}" class="btn btn-or btn-bloc">Je m'inscris</a>
    </div>
  `;
  modaleFond.classList.add("ouverte");
}

function fermerModale(id){
  document.getElementById(id).classList.remove("ouverte");
}

function reobserverReveal(){
  const elements = document.querySelectorAll(".reveal:not(.visible)");
  if("IntersectionObserver" in window && elements.length){
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach(entree => {
        if(entree.isIntersecting){
          entree.target.classList.add("visible");
          observateur.unobserve(entree.target);
        }
      });
    }, { threshold:.1 });
    elements.forEach(el => observateur.observe(el));
  } else {
    elements.forEach(el => el.classList.add("visible"));
  }
}

/* ---------- Remplir un <select> formation depuis les données ---------- */
function remplirSelectFormations(selectId){
  const select = document.getElementById(selectId);
  if(!select) return;
  const formations = RB.lire("formations", FORMATIONS_DEFAUT);
  formations.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = f.nom;
    select.appendChild(opt);
  });
  const params = new URLSearchParams(window.location.search);
  const preselection = params.get("formation");
  if(preselection) select.value = preselection;
}
