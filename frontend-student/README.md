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

## URLs Locales

- Frontend etudiant: http://localhost:5173
- Backend API: http://localhost:5001
- Frontend admin: http://localhost:5174

## Experience Welcome

- Route publique: `/welcome`
- Actions disponibles: `Se connecter` et `Creer mon compte`
- Il n'y a pas de bouton de demo sur la page Welcome

## Structure Principale

- `src/pages`: ecrans (welcome, login, dashboard, etc.)
- `src/components/layout`: layout global et sidebar
- `src/context`: AuthContext, ThemeContext, LangContext
- `src/services/api.js`: appels API
