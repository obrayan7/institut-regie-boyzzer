# Régie Boyzz'er Institut — Site web

Site vitrine + inscription en ligne + réservation en ligne + espace administrateur,
conforme au cahier des charges fourni. Livré en **HTML / CSS / JavaScript pur**
(aucun framework, aucune compilation nécessaire) afin de pouvoir être hébergé
tel quel sur **n'importe quel hébergeur** (mutualisé, VPS, Netlify, Vercel,
GitHub Pages, etc.).

## 1. Contenu du dossier

```
index.html            Accueil
a-propos.html          À propos
formations.html        Nos formations (9 fiches détaillées)
galerie.html           Galerie filtrable
actualites.html        Actualités
temoignages.html        Témoignages + FAQ
contact.html            Contact (adresse, téléphone, WhatsApp, email, carte, formulaire)
inscription.html        Formulaire d'inscription en ligne
reservation.html        Formulaire de réservation en ligne
admin/index.html         Connexion espace administrateur (démo)
admin/dashboard.html     Tableau de bord + gestion de contenu (démo)
assets/css/style.css     Feuille de style unique
assets/js/data.js        Données par défaut (formations, actus, galerie, témoignages, FAQ)
assets/js/main.js        Comportements du site public
assets/js/admin.js       Comportements de l'espace administrateur
assets/img/logo.png      Logo fourni + déclinaisons favicon
robots.txt, sitemap.xml  Référencement (SEO)
404.html                 Page d'erreur personnalisée
```

## 2. Héberger le site (hébergeur différent de celui utilisé pour la conception)

Ce site est 100% statique : il n'a besoin d'aucun serveur applicatif pour
s'afficher. Trois façons courantes de l'héberger :

**A. Hébergement mutualisé classique (cPanel, Plesk, OVH, o2switch, etc.)**
1. Connectez-vous en FTP/SFTP ou via le gestionnaire de fichiers.
2. Copiez tout le contenu de ce dossier dans le répertoire public de votre
   domaine (souvent `public_html/` ou `www/`).
3. Vérifiez que `index.html` est bien à la racine de ce répertoire.
4. Votre site est en ligne à l'adresse de votre nom de domaine.

**B. Hébergement gratuit/rapide (Netlify, Vercel, GitHub Pages, Cloudflare Pages)**
1. Créez un compte sur la plateforme choisie.
2. Glissez-déposez ce dossier (ou connectez un dépôt Git contenant ces fichiers).
3. Aucune commande de build n'est nécessaire.

**C. VPS avec Nginx/Apache**
Placez les fichiers dans `/var/www/votre-site/` et pointez la configuration
du serveur web (`root`) vers ce dossier.

Avant la mise en ligne définitive :
- Remplacez `https://www.votredomaine.com` dans `sitemap.xml` et `robots.txt`
  par votre vrai nom de domaine.
- Remplacez les numéros de téléphone/WhatsApp/email fictifs (`+229 00 00 00 00`,
  `contact@regieboyzzer.institut`) par les vraies coordonnées de l'institut,
  dans chaque page HTML (footer, page Contact, bouton WhatsApp flottant).
- Mettez à jour l'adresse dans `contact.html` (bloc Google Maps).

## 3. Important — ce que fait et ne fait pas cette version

Le cahier des charges demande un back-end complet (base de données MySQL,
envoi d'emails automatiques, notifications WhatsApp, sécurité des mots de
passe, etc. — voir sa section 13 : *Technologies recommandées : Laravel ou
Node.js + MySQL*). Un tel back-end nécessite un serveur d'application et une
base de données, qui ne peuvent pas fonctionner sur un simple hébergement de
fichiers statiques.

Pour que le site soit malgré tout **démontrable et fonctionnel dès
aujourd'hui**, cette version :

- Affiche l'intégralité des pages, contenus et parcours prévus au cahier des
  charges (accueil, à propos, formations, galerie, actualités, témoignages,
  FAQ, contact, inscription, réservation, espace administrateur, tableau de
  bord avec statistiques et graphiques).
- Simule la base de données avec le **stockage local du navigateur**
  (`localStorage`) : les inscriptions, réservations, messages, témoignages et
  modifications faites dans l'espace administrateur sont bien enregistrés et
  persistent d'une visite à l'autre sur le même navigateur/ordinateur.
- L'espace administrateur (`admin/`) est protégé par un identifiant/mot de
  passe de démonstration (**admin / institut2026**), indiqué sur l'écran de
  connexion. Ce n'est **pas** une sécurité suffisante pour la production :
  une vraie authentification doit être vérifiée côté serveur.

**Limites à connaître :**
- Les données ne sont pas partagées entre visiteurs ni entre appareils
  (chaque navigateur a son propre stockage local).
- Aucun email de confirmation ni message WhatsApp n'est réellement envoyé.
- Les fichiers uploadés (pièce d'identité, photo) ne sont pas conservés.

## 4. Passer à une vraie mise en production (recommandé)

Pour obtenir exactement ce que décrit le cahier des charges (base de données,
emails automatiques, notifications WhatsApp, sécurité, tableau de bord
alimenté par de vraies données), il faut ajouter un back-end :

1. **Backend** : Laravel (PHP) ou Node.js/Express, comme recommandé au
   cahier des charges.
2. **Base de données** : MySQL, avec des tables `formations`, `inscriptions`,
   `reservations`, `actualites`, `galerie`, `temoignages`, `utilisateurs_admin`.
3. **API** : remplacer les fonctions du fichier `assets/js/main.js` qui
   utilisent `RB.ajouter(...)` / `RB.lire(...)` par des appels `fetch()` vers
   les routes de cette API (ex. `POST /api/inscriptions`).
4. **Emails / WhatsApp** : brancher un service d'envoi d'email (SMTP,
   SendGrid, Mailgun...) et l'API WhatsApp Business pour les notifications
   automatiques.
5. **Hébergement** : un serveur capable d'exécuter du PHP/Node (VPS,
   hébergement mutualisé avec PHP, ou plateforme comme Railway/Render pour
   Node.js), plus une base MySQL managée.

Le frontend (toutes les pages `.html`, `assets/css`, une grande partie de
`assets/js`) reste réutilisable tel quel : seule la partie « stockage des
données » doit être reliée à ce vrai backend.

## 5. Personnaliser le contenu

- **Formations, actualités, galerie, témoignages, FAQ** : modifiables
  directement dans `assets/js/data.js`, ou via l'espace administrateur (les
  modifications faites dans l'admin sont prioritaires sur ce fichier).
- **Couleurs / polices** : variables CSS en haut du fichier
  `assets/css/style.css` (section `:root`).
- **Logo / favicon** : `assets/img/logo.png` (le favicon est déjà généré en
  plusieurs tailles à partir de ce logo).
