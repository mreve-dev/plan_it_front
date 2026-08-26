# Plan'it — Frontend

*[Read this in English](docs/README.en.md)*

Application web front-end de **Plan'it**, une plateforme de gestion de bénévoles pour un club de badminton. Elle permet aux administrateurs de créer des événements et des missions, et aux bénévoles de consulter et de s'inscrire aux créneaux disponibles.

## 🧱 Stack technique

- **[React](https://react.dev/)** + **TypeScript** — interface utilisateur
- **[Vite](https://vitejs.dev/)** — outil de build et serveur de développement
- **[Zustand](https://github.com/pmndrs/zustand)** — gestion d'état global (authentification, préférences), avec persistance via `localStorage`
- **[TanStack Query](https://tanstack.com/query)** — gestion des données serveur (cache, refetch, invalidation)
- **[React Router](https://reactrouter.com/)** — routage, avec routes protégées selon le rôle (admin / bénévole)
- **[Tailwind CSS](https://tailwindcss.com/)** + **[DaisyUI](https://daisyui.com/)** — style et composants UI
- **[Axios](https://axios-http.com/)** — requêtes HTTP, avec intercepteurs pour l'injection de token et le rafraîchissement automatique
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — gestion et validation des formulaires
- **[react-day-picker](https://daypicker.dev/)** — sélection de dates
- **[Cypress](https://www.cypress.io/)** — tests end-to-end
- **Docker** — conteneurisation pour le déploiement

## ✨ Fonctionnalités principales

### Côté bénévole
- **Dashboard personnel** : prochaine mission, heures de bénévolat du mois, nombre de missions et de compétences, frise interactive de la semaine avec missions filtrées par jour
- **Mes événements** : liste des événements auxquels le bénévole est inscrit, filtrables à venir / passés
- **Mes missions** : liste des inscriptions du bénévole, avec jauge de remplissage du créneau, désinscription avec modale de confirmation
- **Inscription aux créneaux** : consultation des créneaux disponibles d'une mission, regroupés par jour, avec inscription/désinscription directe

### Côté administrateur
- **Dashboard admin** : statistiques globales (événements, missions, bénévoles, taux de remplissage), prochain événement, alertes sur les missions sous-remplies, anniversaires à venir
- **Gestion des événements** : création, modification, suppression, documents associés
- **Gestion des missions** : création (mode manuel ou génération automatique de plusieurs créneaux), modification, suppression, gestion des compétences requises
- **Gestion des créneaux** : création, duplication, modification, suppression, consultation des bénévoles inscrits
- **Gestion des bénévoles** : liste des utilisateurs, gestion des rôles

### Transverses
- **Authentification** : connexion, inscription, mot de passe oublié / réinitialisation, onboarding (sélection des compétences à la première connexion)
- **Thème clair / sombre** : avec option "système" qui suit automatiquement les préférences de l'OS
- **Responsive** : approche mobile first, avec adaptation du layout sur tablette et desktop

## 🎨 Charte graphique

Palette de couleurs de marque :
- **Teal** `#4f9288` / `#104e64` (teal foncé) — couleur principale
- **Rose/mauve** `#9b6581` — couleur secondaire (actions de duplication, accents)
- **Kaki** `#c8c4a0` — couleur tertiaire
- **Crème** `#e6dabb` — fond en thème clair
- **Navy** `#161b27` / `#1e2433` — fond en thème sombre

Chaque mode (clair/sombre) a ses propres variantes de couleurs pour rester lisible et accessible dans les deux thèmes.

## 🚀 Installation

### Prérequis
- Node.js 20+
- npm
- Le backend Plan'it démarré (voir son propre README)

### Étapes

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd <nom-du-dossier>

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env (voir la section Variables d'environnement)

# 4. Lancer le serveur de développement
npm run dev
```

L'application est alors disponible sur `http://localhost:5173`.

## ⚙️ Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_API_BASE_URL=http://localhost:3000
```

⚠️ Ce fichier ne doit **jamais** être commité — il est dans `.gitignore`.

## 🔐 Authentification

L'application utilise un système à double token JWT :
- **`accessToken`** : stocké côté client (Zustand + `localStorage`), courte durée de vie (15 min), injecté automatiquement dans le header `Authorization` de chaque requête via un intercepteur Axios
- **`refreshToken`** : stocké dans un cookie `httpOnly`, jamais accessible en JavaScript, utilisé uniquement pour renouveler l'`accessToken` de façon transparente lorsqu'il expire (intercepteur de réponse qui détecte un 401, rafraîchit le token, puis rejoue la requête initiale)

## 🧪 Tests

```bash
# Ouvrir l'interface Cypress
npx cypress open

# Lancer les tests en mode headless
npx cypress run
```

Les tests end-to-end couvrent notamment le parcours complet de création d'une mission (cas valides et cas d'erreur : champs vides, créneau invalide, dépassement de minuit en génération automatique, etc.).

## 📁 Structure du projet

```
src/
├── components/       # Composants réutilisables (cartes, modales, navigation...)
│   ├── event/
│   ├── mission/
│   ├── missionSlot/
│   └── navbar/
├── pages/            # Pages de l'application, organisées par domaine
│   ├── admin/
│   ├── auth/
│   ├── event/
│   ├── mission/
│   ├── users/
│   └── volunteers/
├── layouts/          # Layouts partagés (public / privé)
├── guards/           # Protection des routes selon l'authentification/le rôle
├── hook/             # Hooks personnalisés (API, mutations React Query)
├── services/api/     # Fonctions d'appel à l'API backend
├── stores/           # State global (Zustand)
├── types/            # Types TypeScript partagés
├── utils/            # Fonctions utilitaires (dates, calculs...)
```

## 🌐 Déploiement

Le projet est buildé avec `npm run build` (sortie dans `dist/`), puis servi comme un site statique — que ce soit via un hébergeur de sites statiques (Netlify, Vercel) ou via le `Dockerfile` fourni, qui construit l'application puis la sert avec Nginx.

Pense à configurer `VITE_API_BASE_URL` avec l'URL réelle du backend déployé avant le build — les variables Vite sont injectées **au moment du build**, pas à l'exécution.