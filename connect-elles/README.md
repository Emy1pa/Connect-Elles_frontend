# Connect-Elles - Frontend

## Vue d'ensemble

Ce repository contient le frontend de la plateforme "Connect-Elles" (anciennement "Femmes & Services"), une application web conçue pour soutenir et autonomiser les femmes entrepreneurs au Maroc. Le frontend est développé avec Next.js pour offrir une expérience utilisateur moderne et responsive.

## Technologie

- **Framework**: [Next.js](https://nextjs.org/) - Framework React pour la production d'applications web
- **UI/UX**: [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitaire
- **Gestion d'état**: [Redux Toolkit](https://redux-toolkit.js.org/) - Bibliothèque de gestion d'état
- **Formulaires**: [React Hook Form](https://react-hook-form.com/) avec [Yup](https://github.com/jquense/yup) pour la validation
- **Requêtes API**: [Axios](https://axios-http.com/) - Client HTTP basé sur les promesses
- **Internationalisation**: [next-i18next](https://github.com/isaachinman/next-i18next) - Solution i18n pour Next.js

## Configuration et installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

### Installation

1. Cloner le repository
   ```bash
   git clone https://github.com/Emy1pa/Connect-Elles_frontend.git
   cd Connect-Elles_frontend
   ```

2. Installer les dépendances
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configurer les variables d'environnement
   Créer un fichier `.env.local` à la racine du projet avec les variables suivantes:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Lancer le serveur de développement
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

### Scripts npm

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run start` - Démarre l'application en mode production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run test` - Exécute les tests Jest

## Fonctionnalités principales

### Authentification et profil utilisateur

- Inscription et connexion
- Réinitialisation de mot de passe
- Profil utilisateur avec détails personnels et professionnels
- Tableau de bord personnalisé

### Réseau d'aide aux femmes entrepreneurs

- Bibliothèque de ressources (articles, guides)
- Programme de mentorat

### Échange de services

- Catalogue de services
- Recherche et filtrage avancés
- Système de prise de rendez-vous
- Système de notation et d'avis

### Interface multilingue

- Support pour le français et l'arabe
- Interface adaptée aux différentes cultures

### Export statique

1. Construire l'application:
   ```bash
   npm run build
   npm run export
   ```

2. Le dossier `out` contient la version statique du site qui peut être déployée sur n'importe quel hébergeur statique.

## Bonnes pratiques

### Accessibilité

- Utilisation des attributs ARIA appropriés
- Tests de contraste de couleurs
- Navigation au clavier
- Support pour les lecteurs d'écran

### Performance

- Optimisation des images via Next.js Image
- Chargement lazy des composants
- Utilisation du SSR et SSG pour optimiser le SEO et les performances
- Code splitting automatique

### SEO

- Métadonnées dynamiques pour chaque page
- Sitemap généré automatiquement
- Optimisation des Open Graph tags

## Contribution

1. Forker le repository
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Add some amazing feature'`)
4. Pusher vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request
