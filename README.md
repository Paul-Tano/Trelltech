# Trelltech

Trelltech est un client mobile léger, rapide et intuitif conçu pour interagir avec l'API officielle de Trello. Conçue pour les professionnels et les particuliers, cette application offre une expérience focalisée et sans friction pour gérer vos espaces de travail, tableaux, listes et cartes directement depuis votre smartphone.

Basée sur une architecture *Serverless*, Trelltech se connecte de manière sécurisée et directe à votre compte Trello sans intermédiaire.

## Fonctionnalités Clés

- **Espaces de travail (Workspaces) :** Visualisez, créez et supprimez vos espaces de travail.
- **Tableaux (Boards) :** Naviguez de manière fluide entre vos tableaux de bord et gérez-les facilement.
- **Listes & Cartes :** Organisez vos tâches via une interface mobile pensée pour l'efficacité (Création, édition et suppression de listes et cartes).
- **Architecture Serverless :** Aucune base de données tierce. Vos données restent sécurisées chez Trello.
- **Interface Moderne :** Développée avec React Native et Expo pour une expérience native et performante sur iOS et Android.

## Prérequis

Assurez-vous d'avoir installé les éléments suivants sur votre machine :
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- npm (installé par défaut avec Node.js)
- Un compte [Trello](https://trello.com) actif

## 📱 Télécharger l'Application (Android)

L'application est prête à être installée sur votre smartphone Android. Vous pouvez télécharger le fichier APK directement depuis ce dépôt :

1. Cliquez ici pour télécharger : **[TrellTech.apk](https://github.com/Paul-Tano/Trelltech/raw/main/TrellTech.apk)**
2. Transférez le fichier sur votre appareil Android (ou téléchargez-le directement depuis le navigateur de votre téléphone).
3. Ouvrez le fichier et autorisez l'installation d'applications issues de sources inconnues si votre téléphone vous le demande.

---

## 💻 Installation pour les Développeurs

Si vous souhaitez explorer le code source ou modifier l'application :

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/Paul-Tano/Trelltech.git
   cd Trelltech
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer l'application :**
   ```bash
   npx expo start
   ```
   *Scannez le QR code affiché dans le terminal avec l'application Expo Go (iOS/Android) pour tester l'application en direct sur votre smartphone.*

## Configuration (Authentification API)

L'application communique directement avec l'API de Trello. Pour fonctionner, elle nécessite que l'utilisateur renseigne ses identifiants développeur Trello lors de son premier lancement (Onboarding) :

1. Rendez-vous sur la [page Power-Up Admin de Trello](https://trello.com/power-ups/admin) pour créer une intégration.
2. Récupérez votre **Clé d'API** (API Key).
3. Générez manuellement un **Token** d'accès.
4. Lancez Trelltech sur votre téléphone et insérez ces deux informations sur l'écran d'accueil.

## Contexte du Projet

Ce projet a été réalisé dans le cadre d'une formation. Il s'agit d'un exercice pédagogique visant à démontrer l'intégration d'une API tierce (Trello) avec React Native et Expo. Il n'est pas destiné à un usage commercial ou à une mise en production officielle.
