# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3c3df2bf-7cd7-4d19-b582-38a7e65ccc59

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3c3df2bf-7cd7-4d19-b582-38a7e65ccc59) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Firebase configuration (Firestore)

To use Firebase as the database for affiliate registrations, create the following environment variables in a `.env` file at the project root (or your hosting dashboard) and restart the dev server:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firestore Security Rules

You need to configure Firestore security rules to allow public access to the `afiliados` collection. Use the rules in `firestore.rules`:

1. Go to Firebase Console > Firestore Database > Rules
2. Replace the default rules with the content from `firestore.rules`
3. Publish the rules

### How it works

The Firestore client is initialized in `src/integrations/firebase/client.ts`. The affiliate form `src/components/AffiliateForm.tsx` writes to the `afiliados` collection using the generated `codigo` as the document ID to ensure uniqueness. If a document with the same `codigo` already exists, the form will show an error and stop the submission.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3c3df2bf-7cd7-4d19-b582-38a7e65ccc59) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
