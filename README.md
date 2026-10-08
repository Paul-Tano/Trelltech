# TrellTech

TrellTech est un client mobile pour Trello, développé avec React Native et Expo. Il permet de gérer ses espaces de travail, boards, listes et cartes depuis un téléphone, avec une interface pensée pour le tactile (thème clair et sombre).

L'application parle directement à l'API REST de Trello : il n'y a pas de serveur intermédiaire ni de base de données tierce. Vos données restent chez Trello.

## Fonctionnalités

- **Espaces de travail** : liste, création, suppression (avec confirmation).
- **Boards** : grille adaptative reprenant la couleur du board Trello ; création, modification, suppression.
- **Listes** : colonnes défilantes alignées au glissement ; création, renommage, archivage.
- **Cartes** : étiquettes, échéance (en retard / bientôt / terminée), indicateurs (description, commentaires, pièces jointes, checklist) et membres assignés.
- **Détail d'une carte** : édition du titre et de la description, déplacement vers une autre liste, assignation des membres du board, marquage de l'échéance comme terminée, ouverture dans Trello.
- **Confort** : tirer pour actualiser, rafraîchissement au retour sur un écran, mises à jour optimistes, notifications de succès ou d'erreur, retours haptiques, accessibilité (libellés pour lecteur d'écran, contrastes AA, zones tactiles de 44 px minimum).

## Sécurité

- Connexion via la page d'autorisation officielle de Trello, avec un token **valable 30 jours** et limité à `read,write`.
- Token stocké **chiffré** sur l'appareil (Keychain / Keystore via `expo-secure-store`).
- Sur mobile, les identifiants passent dans l'en-tête `Authorization` et jamais dans les URL.
- Un token expiré ou révoqué renvoie automatiquement vers l'écran de connexion.
- La déconnexion révoque le token côté Trello.

## Télécharger (Android)

Une ancienne version de l'APK, antérieure à la refonte, est disponible ici : **[TrellTech.apk](https://github.com/Paul-Tano/Trelltech/raw/main/TrellTech.apk)**. Les prochaines versions seront publiées dans les [Releases](https://github.com/Paul-Tano/Trelltech/releases).

Pour générer un APK à jour :

```bash
npx eas build --platform android --profile preview
```

## Installation pour les développeurs

Prérequis : Node.js 20 ou plus, npm, et un compte [Trello](https://trello.com).

```bash
git clone https://github.com/Paul-Tano/Trelltech.git
cd Trelltech
npm install
cp .env.example .env   # puis renseignez les variables (voir ci-dessous)
npx expo start
```

### Configuration Trello

1. Créez un Power-Up sur la [page d'administration Trello](https://trello.com/power-ups/admin) et récupérez sa **clé API**.
2. Dans les *Allowed origins* du Power-Up, ajoutez l'URL de retour utilisée par l'app (par exemple `trelltech://auth`).
3. Renseignez dans `.env` :
   - `EXPO_PUBLIC_TRELLO_API_KEY` : la clé API ;
   - `EXPO_PUBLIC_TRELLO_REDIRECT_URI` : l'URL de retour.
4. Lancez l'app et appuyez sur **Se connecter avec Trello**.

### Scripts

| Commande | Rôle |
|---|---|
| `npm start` | Lance le serveur de développement Expo |
| `npm run typecheck` | Vérifie les types TypeScript |
| `npm run lint` | Lance ESLint |

La CI GitHub Actions exécute le typecheck et le lint à chaque push et pull request.

## Architecture

```
app/          Écrans (expo-router : un fichier = une route)
components/
  ui/         Design system : AppText, Button, IconButton, TextField, Sheet, ActionSheet,
              Toast, Avatar, Chip, Fab, Header, Screen, états vides / erreur / chargement
  board/ card/ list/ workspace/   Composants métier
constants/    Tokens de design (couleurs clair/sombre, espacements, typographie)
hooks/        Accès aux données (useResource, useWorkspaces, useBoards, useBoard, useCard, useMe) + thème
services/     Client HTTP Trello, authentification, stockage sécurisé des identifiants
utils/        Couleurs, dates, erreurs, confirmations, haptique
```

## Contexte

Projet réalisé dans le cadre d'une formation Epitech : il montre l'intégration d'une API tierce (Trello) avec React Native et Expo. Il n'est pas destiné à un usage commercial.
