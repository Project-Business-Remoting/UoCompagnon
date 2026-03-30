FROM node:20-alpine

WORKDIR /app

# Copier uniquement les fichiers nécessaires à l'installation des dépendances
# Cela permet d'utiliser le cache Docker et d'accélérer les builds
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production

# Copier le reste du code de l'application
COPY . .

# Exposer le port par défaut (Render ignorera cela et utilisera son propre port dynamique)
EXPOSE 5001

# Lancer l'application
CMD ["node", "server.js"]
