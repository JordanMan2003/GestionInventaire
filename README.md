## StockEZ API

API pour le projet **StockEZ** – Application mobile de gestion d’inventaire  
(Cadre académique – Développement Web / Mobile)

---

## Historique du projet

- **Conception et développement** : Manoel Jordan Tchoukouaha
- **Objectif** : Créer une API REST sécurisée permettant la gestion d’un inventaire par utilisateur

---

## Structure et signification du projet

| Élément              | Description                                     |
| -------------------- | ----------------------------------------------- |
| **README.md**        | Documentation de l’API                          |
| **package.json**     | Dépendances et scripts Node.js                  |
| **.env**             | Variables d’environnement (non versionné)       |
| **src/**             | Code source de l’API                            |
| **src/app.js**       | Point d’entrée de l’application                 |
| **src/routes/**      | Définition des routes de l’API                  |
| **src/controllers/** | Gestion des requêtes et réponses                |
| **src/services/**    | Logique métier                                  |
| **src/middleware/**  | Sécurité, authentification, gestion des erreurs |
| **src/models/**      | Modèles de données                              |
| **src/config/**      | Configuration (base de données, etc.)           |
| **src/db/**          | Migrations et gestion de la base de données     |

---

## Environnement du projet

- Node.js
- Express (API REST)
- Base de données relationnelle (MySQL ou PostgreSQL)
- Authentification JWT
- CORS et Helmet pour la sécurité
- Variables d’environnement via dotenv
- PM2 pour l’exécution en arrière-plan (production)

---

## Pré-requis système

- Node.js (version LTS recommandée)
- npm
- Git
- Base de données MySQL ou PostgreSQL
- Accès à un terminal
- (Optionnel) NGINX ou Apache pour HTTPS

---

## Installation des dépendances

Depuis le dossier **stockez-api** :

```bash
npm install
```

---

## Configuration du fichier `.env`

Créer un fichier `.env` à la racine du projet **stockez-api**.

### Exemple de `.env`

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=stockez
DB_USER=stockez_user
DB_PASSWORD=motdepasse

JWT_SECRET=cle_secrete_tres_secure
```

⚠️ Le fichier `.env` ne doit jamais être versionné.

---

## Installation et configuration de MySQL (Ubuntu)

```bash
sudo apt update
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Création de la base de données et de l’utilisateur

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE InventoryDB;
CREATE USER 'manoel_user'@'localhost' IDENTIFIED BY 'manoel12345';
GRANT ALL PRIVILEGES ON InventoryDB.* TO 'manoel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Initialisation de la base de données

- Vérifier la présence des migrations
- Appliquer les migrations prévues par le projet
- S’assurer que les tables sont créées correctement

---

## Démarrer l’API

### Mode développement

```bash
npm run dev
```

---

### Mode production

```bash
npm start
```

---

## Lancer l’API en arrière-plan avec PM2 (optionnel)

```bash
npm install -g pm2
pm2 start npm --name "stockez-api" -- start
```

### Commandes utiles PM2

```bash
pm2 list
pm2 logs stockez-api
pm2 restart stockez-api
pm2 stop stockez-api
pm2 delete stockez-api
```

---

## Accès à l’API

Par défaut, l’API est accessible à :

```
http://localhost:3000
```

Les routes protégées nécessitent une authentification.

---

## Bonnes pratiques

- Toujours lancer l’API avant l’application mobile
- Ne jamais versionner le fichier `.env`
- Tester les routes avec Postman ou équivalent
- Vérifier les permissions utilisateur sur chaque requête

---

## Contexte académique

Projet réalisé dans un cadre académique afin de démontrer la conception d’une API REST sécurisée, structurée et maintenable.
