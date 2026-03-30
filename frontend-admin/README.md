# Frontend Admin - UO-Compagnon

Application React/Vite du portail administrateur UO-Compagnon.

## Stack

- React 19
- Vite 8
- React Router
- Lucide React
- Context API (auth, theme)

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Variables d'environnement

Ce frontend supporte la variable suivante :

```bash
VITE_STUDENT_PORTAL_URL=http://localhost:5173/welcome
```

Elle est utilisee au logout admin pour rediriger vers le portail etudiant sans URL localhost hardcodee.

### Quick start env

```bash
cp .env.example .env
```

Ensuite, adaptez la valeur selon votre environnement :

- Local : `VITE_STUDENT_PORTAL_URL=http://localhost:5173/welcome`
- Production : `VITE_STUDENT_PORTAL_URL=https://app.votre-domaine.com/welcome`

## URLs Locales

- Frontend admin: http://localhost:5174
- Backend API: http://localhost:5001
- Frontend etudiant: http://localhost:5173

## Authentification et securite

- L'authentification est geree via cookies HttpOnly emis par le backend.
- Toutes les requetes API utilisent `credentials: include`.
- Le client API gere les reponses JSON et non-JSON de facon robuste.
- Les routes backend de modification de contenus sont protegees par role admin (RBAC).

## Fonctionnalites principales

- Dashboard admin: metriques globales de la plateforme.
- Gestion des contenus: CRUD complet des contenus (titre, categorie, etape, priorite).
- Gestion des questions: visualisation des questions directes/anonymes et reponse aux etudiants.
- Theme: mode clair/sombre pour le confort d'utilisation.

## Structure principale

- `src/pages`: ecrans admin (login, dashboard, contenus, questions)
- `src/components/layout`: layout admin (sidebar, topbar)
- `src/context`: AuthContext, ThemeContext
- `src/services/api.js`: appels API
