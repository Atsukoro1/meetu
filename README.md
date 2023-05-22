# Meetu: A Privacy-Focused Twitter Clone

Meetu, a Twitter clone, is born out of the desire for enhanced privacy control in the realm of social networking. In today's digital era, many platforms fall short in respecting user privacy and enabling complete control over their data and information. Meetu is designed to grant users the control they deserve. Say hello to more privacy, more control, and a more personalized social media experience.

## Technologies Used
- **React**: A JavaScript library for UI development.
- **Next.JS**: A JavaScript library for server-side rendering and static websites.
- **Typescript**: A statically-typed superset of JavaScript.
- **TailwindCSS**: A utility CSS library for easy component styling.
- **Mantine**: A set of React components designed for quick prototyping.
- **Jotai**: A state management library for React applications.
- **TRPC**: A library for creating type-safe APIs in TypeScript.
- **Prisma**: An ORM tool for easy database work in TypeScript.
- **Postgresql**: An open-source object-relational database system.
- **Supabase**: An open-source alternative to Firebase that provides backend as a service.

## Installation
### 1. Prerequisites
Before starting the application, make sure you have the following tools installed:
a. Node.js
b. PNPM
c. Git
d. Prisma CLI

### 2. Cloning the Repository
Clone this repository onto your computer using the `git clone` command.

### 3. Installing Dependencies
In the project folder, run the command `pnpm install` to install all dependencies necessary for running the application.

### 4. Configuring .env Variables
You need to create a `.env.local` file in the root directory of the project. This file should contain all the necessary configuration variables that the application requires. Below is an example of what the file should look like:

```txt
DATABASE_URL="your-database-URL"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000/"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_SUPABASE_PUBLIC_STORAGE_URL="your-supabase-storage-url"
NEXT_PUBLIC_PUSHER_APPID="your-pusher-appid"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_PUSHER_CLUSTER=eu
PUSHER_USETLS=true
```

(Note: Replace 'your-xxx' with the actual values for your project)

### 5. Generating Prisma Schemas and Types
Before starting the application, you need to generate Prisma schemas and types, and also push the database tables to your database. This can be achieved using the commands `npx prisma generate` and `npx prisma db push`.

### 6. Starting the Application
You can now start the application using the command `pnpm run dev`. The application should be accessible at `http://localhost:3000`.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please ensure to follow the code style guide and run tests before submitting a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
