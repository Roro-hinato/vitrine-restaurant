# Le Beffroi — Site portfolio

Site vitrine fictif d'une brasserie traditionnelle du Nord de la France, réalisé en HTML/CSS/JavaScript vanilla, sans framework ni dépendances de build.

> ⚠️ Site de démonstration. Le restaurant « Le Beffroi », son adresse, son équipe et ses avis sont entièrement fictifs.

## ✨ Fonctionnalités

- **Design éditorial** soigné (typographie Fraunces + Cormorant Garamond, palette terre cuite/crème)
- **Hero plein écran** avec parallax cinématographique
- **Carte interactive** avec onglets Entrées / Plats / Desserts / Boissons
- **Galerie** avec lightbox (navigation clavier, swipe tactile)
- **Statut "Ouvert / Fermé" en temps réel** calculé selon les horaires
- **Modale de réservation** avec validation de formulaire
- **Section "Les Chefs"** et **avis clients** avec avatars
- **Compteurs animés** sur les chiffres clés
- **Carte Google Maps** intégrée avec pin pulsant
- **Navigation adaptative** : la couleur change selon la section survolée
- **100% responsive** : desktop, tablette, mobile
- **Accessibilité** : skip-link, focus visibles, ARIA, support clavier
- **SEO** : Open Graph, Twitter Cards, JSON-LD Schema.org Restaurant
- **Performance** : `loading="lazy"` sur les images, polices preconnect

## 📁 Structure

```
.
├── index.html       Page principale
├── styles.css       Tous les styles, organisés en sections
├── script.js        Comportement (10 modules)
├── 404.html         Page d'erreur custom
├── robots.txt       Directives crawlers
├── sitemap.xml      Sitemap XML
├── .nojekyll        Désactive Jekyll sur GitHub Pages
└── README.md        Ce fichier
```

## 🚀 Mise en ligne sur GitHub Pages

1. Créez un repo public sur GitHub (par exemple `le-beffroi`)
2. Poussez ces fichiers à la racine
3. Settings → Pages → Source : `Deploy from a branch` → Branche `main` / dossier `/ (root)`
4. Attendez 1 à 2 minutes, votre site est en ligne sur `https://<votre-pseudo>.github.io/le-beffroi/`

### Avant la mise en ligne

Remplacez `https://votre-domaine.github.io/` par l'URL réelle de votre site dans :
- `index.html` (balises `og:url`, `canonical`, JSON-LD)
- `robots.txt`
- `sitemap.xml`
- `404.html` (le bouton retour fonctionne en relatif, pas besoin d'y toucher)

## 🛠️ Stack technique

- **HTML5** sémantique
- **CSS3** moderne : variables, grid, clamp, backdrop-filter, container queries-ready
- **JavaScript ES6+** vanilla, sans dépendances
- **Google Fonts** : Fraunces (titres), Cormorant Garamond (textes)
- **Images** : Unsplash + Pexels (libres de droits)

## 📝 Crédits

- Photos : [Unsplash](https://unsplash.com) & [Pexels](https://pexels.com)
- Avatars : [Pravatar](https://pravatar.cc)
- Cartographie : [Google Maps](https://www.google.com/maps)
- Polices : [Google Fonts](https://fonts.google.com)

## 📄 Licence

Projet personnel à but pédagogique. Le code source peut être librement consulté et adapté pour usage non commercial.
