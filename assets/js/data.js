/* ==========================================================================
   Données du site — Régie Boyzz'er Institut
   Ces données servent de contenu par défaut. L'espace administrateur
   (démo côté client) permet de les enrichir ; elles sont alors sauvegardées
   dans le localStorage du navigateur. Pour une vraie mise en production,
   ces données doivent provenir d'une base de données (voir README.md).
   ========================================================================== */

const FORMATIONS_DEFAUT = [
  {
    id: "coiffure-professionnelle",
    nom: "Coiffure professionnelle",
    degrade: "deg-1",
    duree: "6 mois",
    niveau: "Débutant à avancé",
    resume: "Coupe, coloration, coiffage et techniques modernes pour exercer en salon ou à domicile.",
    programme: [
      "Bases de la coiffure et hygiène professionnelle",
      "Techniques de coupe homme / femme",
      "Coloration, mèches et balayage",
      "Coiffage événementiel et mariage",
      "Gestion d'un salon de coiffure"
    ],
    debouches: "Coiffeur(se) en salon, coiffeur(se) à domicile, création de salon.",
    admission: "Dès 16 ans, aucun diplôme préalable requis, entretien de motivation."
  },
  {
    id: "esthetique",
    nom: "Esthétique",
    degrade: "deg-2",
    duree: "5 mois",
    niveau: "Débutant",
    resume: "Soins du corps et du visage, maquillage et techniques d'embellissement.",
    programme: [
      "Anatomie et hygiène cutanée",
      "Soins du visage et gommages",
      "Techniques de maquillage jour / soir",
      "Épilation et soins du corps",
      "Conseil beauté et vente de produits"
    ],
    debouches: "Esthéticien(ne), institut de beauté, spa, activité indépendante.",
    admission: "Dès 16 ans, entretien de motivation."
  },
  {
    id: "soins-de-visage",
    nom: "Soins de visage",
    degrade: "deg-3",
    duree: "3 mois",
    niveau: "Débutant",
    resume: "Diagnostic de peau, protocoles de soin et techniques de relaxation faciale.",
    programme: [
      "Diagnostic et types de peau",
      "Protocoles de nettoyage et hydratation",
      "Masques et sérums professionnels",
      "Massages faciaux et relaxation",
      "Hygiène et matériel professionnel"
    ],
    debouches: "Spécialiste soins du visage en institut ou spa.",
    admission: "Dès 16 ans."
  },
  {
    id: "manicure",
    nom: "Manicure",
    degrade: "deg-4",
    duree: "2 mois",
    niveau: "Débutant",
    resume: "Soins des mains et des ongles, pose de vernis semi-permanent et nail art.",
    programme: [
      "Hygiène et soins des mains",
      "Limage et mise en forme des ongles",
      "Pose de vernis classique et semi-permanent",
      "Initiation au nail art",
      "Relation client et hygiène du matériel"
    ],
    debouches: "Prothésiste ongulaire, institut, activité à domicile.",
    admission: "Dès 16 ans."
  },
  {
    id: "pedicure",
    nom: "Pédicure",
    degrade: "deg-5",
    duree: "2 mois",
    niveau: "Débutant",
    resume: "Soins des pieds, techniques de bien-être et prévention des affections courantes.",
    programme: [
      "Anatomie du pied et hygiène",
      "Soins et gommage des pieds",
      "Pose de vernis et finitions",
      "Massage plantaire et bien-être",
      "Prévention des affections courantes"
    ],
    debouches: "Spécialiste pédicure en institut ou spa.",
    admission: "Dès 16 ans."
  },
  {
    id: "tresses-africaines",
    nom: "Tresses africaines",
    degrade: "deg-6",
    duree: "3 mois",
    niveau: "Tous niveaux",
    resume: "Techniques traditionnelles et modernes de tresses, nattes et coiffures africaines.",
    programme: [
      "Préparation et soin du cheveu crépu",
      "Techniques de tresses classiques",
      "Nattes collées et vanilles",
      "Coiffures modernes et tendances",
      "Finitions et entretien"
    ],
    debouches: "Coiffeur(se) spécialisé(e), activité à domicile ou en salon.",
    admission: "Dès 16 ans."
  },
  {
    id: "barber",
    nom: "Barber",
    degrade: "deg-7",
    duree: "4 mois",
    niveau: "Débutant à avancé",
    resume: "Coupe homme, taille de barbe et rasage traditionnel pour devenir barbier professionnel.",
    programme: [
      "Techniques de coupe homme (ciseaux, tondeuse)",
      "Dégradés et finitions précises",
      "Taille et dessin de barbe",
      "Rasage traditionnel au coupe-chou",
      "Installation et gestion d'un barbershop"
    ],
    debouches: "Barbier en salon, barbershop indépendant.",
    admission: "Dès 16 ans."
  },
  {
    id: "extension-de-cheveux",
    nom: "Extension de cheveux",
    degrade: "deg-8",
    duree: "1 mois",
    niveau: "Intermédiaire",
    resume: "Poses d'extensions (kératine, clips, tissage) pour densifier et allonger la chevelure.",
    programme: [
      "Types d'extensions et choix des matières",
      "Pose à la kératine",
      "Pose par tissage et clips",
      "Entretien et dépose",
      "Conseils et suivi client"
    ],
    debouches: "Coiffeur(se) spécialisé(e) en extensions.",
    admission: "Dès 16 ans, une base en coiffure est un plus."
  },
  {
    id: "massage",
    nom: "Massage",
    degrade: "deg-1",
    duree: "3 mois",
    niveau: "Débutant",
    resume: "Techniques de massage bien-être du corps pour instituts, spas et clientèle privée.",
    programme: [
      "Anatomie de base et contre-indications",
      "Massage relaxant du corps",
      "Massage des pieds et du dos",
      "Utilisation des huiles essentielles",
      "Installation d'une cabine de massage"
    ],
    debouches: "Masseur(se) en spa, institut ou activité indépendante.",
    admission: "Dès 18 ans."
  }
];

const ACTUALITES_DEFAUT = [
  {
    id: "a1",
    titre: "Ouverture des inscriptions — session de septembre",
    date: "2026-06-20",
    degrade: "deg-2",
    extrait: "Les inscriptions pour la session de septembre sont ouvertes pour toutes nos formations. Places limitées."
  },
  {
    id: "a2",
    titre: "Nouvelle formation : Extension de cheveux",
    date: "2026-06-05",
    degrade: "deg-5",
    extrait: "Nous lançons une formation courte et intensive dédiée aux techniques d'extension de cheveux."
  },
  {
    id: "a3",
    titre: "Remise des certificats — promotion Éclat 2026",
    date: "2026-05-18",
    degrade: "deg-6",
    extrait: "Retour en images sur la cérémonie de remise des certificats de notre promotion Éclat."
  },
  {
    id: "a4",
    titre: "Concours interne de coiffure créative",
    date: "2026-04-28",
    degrade: "deg-3",
    extrait: "Nos étudiants en coiffure se sont affrontés lors d'un concours de créativité très applaudi."
  }
];

const TEMOIGNAGES_DEFAUT = [
  { id:"t1", nom:"Fadila G.", formation:"Coiffure professionnelle", avis:"Une formation complète et des formateurs très patients. J'ai ouvert mon salon 6 mois après mon diplôme." },
  { id:"t2", nom:"Yasmine A.", formation:"Esthétique", avis:"L'ambiance est chaleureuse et le programme très pratique. Je recommande à 100%." },
  { id:"t3", nom:"Carine D.", formation:"Barber", avis:"Grâce à l'institut, je travaille aujourd'hui dans le meilleur barbershop de la ville." },
  { id:"t4", nom:"Reine M.", formation:"Tresses africaines", avis:"Les techniques apprises sont vraiment professionnelles, je me suis installée à mon compte." }
];

const GALERIE_DEFAUT = [
  { id:"g1", titre:"Salle de formation", categorie:"salle", degrade:"deg-1" },
  { id:"g2", titre:"Atelier coiffure", categorie:"ateliers", degrade:"deg-2" },
  { id:"g3", titre:"Avant / Après — coloration", categorie:"avant-apres", degrade:"deg-3" },
  { id:"g4", titre:"Nos étudiants", categorie:"etudiants", degrade:"deg-4" },
  { id:"g5", titre:"Remise de certificats", categorie:"diplomes", degrade:"deg-5" },
  { id:"g6", titre:"Atelier maquillage", categorie:"ateliers", degrade:"deg-6" },
  { id:"g7", titre:"Avant / Après — tresses", categorie:"avant-apres", degrade:"deg-7" },
  { id:"g8", titre:"Promotion diplômée", categorie:"diplomes", degrade:"deg-8" },
  { id:"g9", titre:"Salle de manucure", categorie:"salle", degrade:"deg-3" },
  { id:"g10", titre:"Groupe d'étudiants", categorie:"etudiants", degrade:"deg-2" },
  { id:"g11", titre:"Atelier barbier", categorie:"ateliers", degrade:"deg-5" },
  { id:"g12", titre:"Avant / Après — soins visage", categorie:"avant-apres", degrade:"deg-1" }
];

const FAQ_DEFAUT = [
  { q:"Comment s'inscrire à une formation ?", r:"Il vous suffit de remplir le formulaire d'inscription en ligne disponible sur la page « Inscription », d'y joindre une pièce d'identité et une photo, puis de valider. Vous recevrez un email de confirmation avec votre numéro d'inscription." },
  { q:"Quels sont les frais de formation ?", r:"Les frais varient selon la formation choisie et sa durée. Contactez-nous par téléphone ou WhatsApp pour recevoir la grille tarifaire à jour et connaître les facilités de paiement." },
  { q:"Quelle est la durée des formations ?", r:"Selon la spécialité, les formations durent de 1 à 6 mois. La durée exacte de chaque formation est indiquée sur sa fiche détaillée dans la rubrique « Nos formations »." },
  { q:"Les cours sont-ils pratiques ?", r:"Oui. Nos formations combinent théorie et pratique intensive en atelier, avec du matériel professionnel et des mises en situation réelles avec une clientèle." },
  { q:"Le diplôme est-il reconnu ?", r:"Chaque étudiant reçoit un certificat de fin de formation délivré par l'institut, attestant des compétences acquises et du volume d'heures suivi." }
];
