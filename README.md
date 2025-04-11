# DevnTalk

DevnTalk is a developer-centric collaboration platform that integrates real-time communication, live streaming, and structured meetings. 
It allows users to create or join workspaces, invite members. Designed for remote teams. DevnTalk enhances productivity by providing a seamless environment for discussions, and project tracking.

![Home-Page](/public/images/home.png)

## Features

1. **Workspaces & RBAC**: Create or join workspaces with Role-Based Access Control, ensuring secure and organized collaboration.

2. **Real-Time Communication**: Engage in instant meetings for daily stand-ups and utilize live streaming for announcements, enhancing team interaction.

3. **GitHub Integration**: Seamlessly link discussions to GitHub repositories, pull requests, and issues, streamlining the development workflow.

4. **Task Management**: Assign tasks, set deadlines, and track progress using the integrated task board, facilitating efficient project management.


## Technologies Used

DevnTalk leverages a modern tech stack to deliver a robust and efficient platform:

### Frontend:

- **Next.js**: React framework for server-side rendering and static site generation.

- **TypeScript**: Typed superset of JavaScript for improved developer experience.

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

### Backend:
 
- **Node.js**: JavaScript runtime for building scalable server-side applications.

- **Express**: Web application framework for Node.js.

- **Prisma**: Next-generation ORM for database management.


### Authentication:

- **Clerk**: User management and authentication service.


### Video Conferencing:

- **Stream Video SDK**: SDK for integrating video calling capabilities.


### Database:

- **PostgreSQL**: Relational database for data storage.


## Getting Started

Follow these steps to set up and run DevnTalk locally:

1. Clone the Repository:
```git
  git clone https://github.com/Coderx85/DevnTalk.git
```

2. Navigate to the Project Directory:

```git
cd DevnTalk
```

3. Install Dependencies:
```git
npm install
```

2. **Environment Setup 🔐**

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Update the following variables in `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk public key
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `STREAM_API_KEY`: Your Stream API key
- `STREAM_API_SECRET`: Your Stream secret key
- `DATABASE_URL`: Your PostgreSQL connection string
- `RESEND_API_KEY`: Your Resend API key

> **Note:** Never commit `.env` or `.env.local` files to the repository

3. **Development**
```bash
npm run dev     # Start with Turbopack
# or
docker compose up --build   # Start with Docker
```

Visit [http://localhost:3000](http://localhost:3000)