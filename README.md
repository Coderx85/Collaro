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

4. Set Up Environment Variables: 
- Create a .env.local file in the root directory and add the necessary environment variables as specified in the .env.example file.


5. Run the Development Server:
```git
npm run dev
```

6. Access the Application: 

Open http://localhost:3000 in your browser to view the application.

## Contributing

We welcome contributions to DevnTalk. To contribute:

1. **Fork the Repository**: 

Click on the 'Fork' button at the top right of the repository page.

2. **Create a Feature Branch:**
```git
git checkout -b feature/YourFeatureName
```

3. **Commit Your Changes**:
```git
git commit -m 'Add some feature'
```

4. **Push to the Branch**:
```git
git push origin feature/YourFeatureName
```

5. **Submit a Pull Reques**t: 

Open a pull request to the main branch of the original repository.

Please ensure your code adheres to the project's coding standards and includes appropriate documentation.