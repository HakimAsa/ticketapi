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

- `POST /api/admin/login` — Connexion admin (renvoie un token JWT)
- Middleware `authenticateAdmin` pour protéger les routes admin

### 🎉 Événements

- `GET /api/events` — Liste des événements publics
- `POST /api/admin/events` — Créer un événement _(admin)_
- `PUT /api/admin/events/:id` — Modifier un événement _(admin)_
- `DELETE /api/admin/events/:id` — Marquer un événement comme supprimé _(admin)_
- Statut des événements mis à jour automatiquement à 23h59 à la date de fin.

### 👥 Participation

- `POST /api/events/:id/participate` — Participer à un événement (nom, prénom, email)
- Génère un ticket unique + email (QR code bientôt ajouté)
- Empêche de s'inscrire si l'événement est complet

### 📊 Statistiques (admin)

- `GET /api/admin/events/stats` — Nombre de participants par événement

## 📦 Structure

```
/config
    default.json
    custom-environment-variables.json
/routes
  adminAuth.js
  events.js
/controllers
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
