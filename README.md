# MonetaApp – Agricultural Produce Tracker

A simple web application with a Hebrew UI for tracking agricultural produce (peaches, nectarines, carobs, etc.).

## Overview

MonetaApp is designed to help farmers monitor and manage their harvest with:

1. **Hebrew-first interface** – User-friendly UI with Hebrew text and clear, simple design
2. **Data persistence** – Store produce records in MongoDB
3. **Responsive design** – Works on desktop and mobile browsers
4. **Modern tech stack** – Built with Next.js, React, and Tailwind CSS
5. **GitHub integration** – Ready for version control and collaboration

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/MonetaApp.git
cd MonetaApp
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

This installs: Next.js, React, Tailwind CSS, MongoDB driver, and environment utilities.

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Then update `MONGODB_URI` with your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farm?retryWrites=true&w=majority
```

**Note:** If you don't have MongoDB configured, the app will work with in-memory storage (data resets on server restart). To use persistent storage, create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The app will open at http://localhost:3000 with the produce entry interface. The app automatically connects to MongoDB in the background.

### 5. Test the app

- **Home page** displays all produce items stored in the system
- **Add new item** using the form input
- Data is fetched and saved via the internal API (`/api/produce`)
- Refresh the page – data should persist (if MongoDB is configured)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       – Main layout component
│   ├── page.tsx         – Home page with produce form and list
│   ├── globals.css      – Global styles
│   └── api/
│       └── produce/
│           └── route.ts – API endpoint for GET/POST produce items
└── lib/
    └── mongodb.ts       – MongoDB connection logic

.env.local              – Environment variables (create from template)
next.config.ts          – Next.js configuration
tailwind.config.ts      – Tailwind CSS settings
tsconfig.json           – TypeScript configuration
```

## Internationalization (i18n)

The app uses Next.js built-in i18n features with Hebrew (`he`) as the default locale. All UI text and prompts are displayed in Hebrew.

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm build

# Start production server
npm run start

# Run linter
npm run lint
```

## Pushing to GitHub

Once you've set up your GitHub repository:

```bash
git add .
git commit -m "Initial MonetaApp scaffold"
git branch -M main
git remote add origin https://github.com/your-username/MonetaApp.git
git push -u origin main
```

**Tip:** Replace `your-username` with your actual GitHub username.

## Future Enhancements

The project is structured for easy expansion with features such as:
- Inventory management
- Production reports and analytics
- User authentication
- Mobile app version
- Data export (CSV/PDF)

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Next.js API Routes
- **Database:** MongoDB (optional for persistent storage)
- **Styling:** Tailwind CSS 4
- **Development:** ESLint, TypeScript

## License

This project is open source and available for personal and educational use.
