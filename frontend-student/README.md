# Frontend Etudiant - UO-Compagnon

Application React/Vite du portail etudiant UO-Compagnon.

## Stack

- React 19
- Vite 8
- React Router
- Lucide React
- Context API (auth, theme, langue)

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
VITE_ADMIN_PORTAL_URL=http://localhost:5174
```

Elle est utilisee sur la page Welcome pour le lien vers le portail admin.

### Quick start env

```bash
cp .env.example .env
```

Ensuite, adaptez la valeur selon votre environnement :

- Local : `VITE_ADMIN_PORTAL_URL=http://localhost:5174`
- Production : `VITE_ADMIN_PORTAL_URL=https://admin.votre-domaine.com`

## URLs Locales

- Frontend etudiant: http://localhost:5173
- Backend API: http://localhost:5001
- Frontend admin: http://localhost:5174

## Authentification et securite

- L'authentification est geree via cookies HttpOnly emis par le backend.
- Toutes les requetes API utilisent `credentials: include`.
- Le client API gere les reponses JSON et non-JSON de facon robuste.

## Experience Welcome

- Route publique: `/welcome`
- Actions disponibles: `Se connecter` et `Creer mon compte`
- Il n'y a pas de bouton de demo sur la page Welcome

## Internationalisation (i18n)

- Les traductions sont centralisees dans `src/i18n/fr.json` et `src/i18n/en.json`.
- Le contexte `LangContext` expose `t("cle")` pour la resolution des textes.
- Les ecrans Welcome, Dashboard, FAQ, Questions et JourneyHub utilisent les cles i18n.

## Structure principale

- `src/pages`: ecrans (welcome, login, dashboard, etc.)
- `src/components/layout`: layout global et sidebar
- `src/context`: AuthContext, ThemeContext, LangContext
- `src/services/api.js`: appels API
