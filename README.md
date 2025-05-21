# 🌟 API de Gestion d'Événements

Cette API permet aux administrateurs de créer, modifier, supprimer (logiquement), et consulter les événements. Les utilisateurs peuvent consulter les événements et y participer sans créer de compte.

## 🚀 Lancement du serveur

```bash
npm install
npm run dev
```

Assure-toi d’avoir un fichier `config/default.json et config/custom-environment-variable.json` avec les variables suivantes :

```env
PORT=3025
tk_db=postgresql://postgres:password@host:port/dbname
...
```

## 📚 Fonctionnalités

### 🔐 Authentification Admin

- `POST /api/v1/auth/admin/login` — Connexion admin (renvoie un token JWT)
- Middleware `authenticateAdmin` pour protéger les routes admin

### 🎉 Événements

- `GET /api/v1/events` — Liste des événements publics
- `POST /api/v1/admin/events` — Créer un événement _(admin)_
- `PUT /api/v1/admin/events/:id` — Modifier un événement _(admin)_
- `DELETE /api/v1/admin/events/:id` — Marquer un événement comme supprimé _(admin)_
- Statut des événements mis à jour automatiquement à 23h59 à la date de fin.

### 👥 Participation

- `POST /api/v1/events/:id/participate` — Participer à un événement (nom, prénom, email)
- Génère un ticket unique + email (QR code bientôt ajouté)
- Empêche de s'inscrire si l'événement est complet

### 📊 Statistiques (admin)

- `GET /api/v1/admin/events/stats` — Nombre de participants par événement

## 📦 Structure

```
/config
  default.json
  custom-environment-variables.json
/routes
  admin.routes.js
  event.routes.js
/controllers
  /admin/auth.controllers.js
  /events/admin/event.controllers.js
  /events/public/event.controllers.js
/startup
    db.js
/index.js
```

## 🔪 Tests

Utiliser Postman ou Thunder Client pour tester les endpoints.

## ✉️ Envoi d'email

L'envoi de ticket se fait automatiquement après participation (via nodemailer + mailgun).

## ✅ À venir

- QR Code dans le ticket
- Panel admin frontend
