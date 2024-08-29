# InkFinder

InkFinder is a Next.js application designed to help users find tattoo artists, generate AI-powered tattoo designs, and manage their tattoo ideas.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (sign up, sign in, sign out)
- Search for tattoo artists and shops with filtering options
- AI-powered tattoo design generation using DALL-E 3
- Save and share generated tattoo designs
- Personal gallery for saved designs
- Dark mode support

## Technologies Used

- Next.js 14.2.6
- React 18
- TypeScript
- Tailwind CSS
- Supabase for authentication and database
- OpenAI API for AI-generated designs
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/inkfinder.git
   cd inkfinder
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## Project Structure

```
inkfinder/
├── app/
│   ├── api/
│   │   ├── generate-design/
│   │   └── search/
│   ├── gallery/
│   ├── search/
│   ├── design/
│   ├── about/
│   ├── signin/
│   ├── signup/
│   └── layout.tsx
├── components/
│   ├── ArtistCard.tsx
│   ├── GalleryView.tsx
│   ├── Navigation.tsx
│   ├── SearchBar.tsx
│   ├── ShopCard.tsx
│   ├── SignOutButton.tsx
│   ├── TattooDesignGenerator.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── database.types.ts
│   ├── openai.ts
│   └── supabase.ts
├── public/
├── styles/
│   └── globals.css
├── .env.local
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Key Components

- `TattooDesignGenerator`: Handles the AI-powered design generation process.
- `SearchBar`: Provides filtering options for searching artists and shops.
- `GalleryView`: Displays the user's saved designs.
- `Navigation`: Main navigation component with responsive design.

## API Routes

- `/api/generate-design`: Generates a tattoo design using the OpenAI API.
- `/api/search`: Searches for tattoo artists and shops based on user criteria.

## Database Schema

### saved_designs
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- prompt: TEXT
- design: TEXT (URL of the generated design)
- created_at: TIMESTAMP

### shared_designs
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- prompt: TEXT
- design: TEXT (URL of the generated design)
- created_at: TIMESTAMP

## Deployment

This project can be deployed on Vercel or any other platform that supports Next.js applications. Make sure to set up the environment variables in your deployment platform.

1. Connect your GitHub repository to Vercel.
2. Configure the environment variables in the Vercel dashboard.
3. Deploy the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
