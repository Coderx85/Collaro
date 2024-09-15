# DevnTalk

DevnTalk is a web application designed for seamless video communication. It includes features such as video calling, user authentication, and various UI components to enhance user experience.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Features

- **Video Calling**: Powered by @stream-io/video-react-sdk.
- **User Authentication**: Managed by @clerk/nextjs.
- **Responsive UI**: Built with modern React components and Next.js.
- **Navigation**: Sidebar with links to Home, Upcoming, Previous, Recordings, and Personal Room.
- **Error Handling**: Custom error handling for video call functionalities.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/devtalk.git
   cd devtalk
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add your environment variables.

   ```env
   NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-api>
   CLERK_API_KEY=<your-clerk-api-key>
   NEXT_PUBLIC_STREAM_API_KEY=<your-stream-api-key>
   STREAM_SECRET_KEY=<your-stream-secret-api>
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- **Home Page**: Displays the current date and time.
- **Upcoming**: Shows upcoming meetings.
- **Previous**: Lists previous meetings.
- **Recordings**: Access to recorded meetings.
- **Personal Room**: Personal video call room.

## Project Structure

```
.
├── components
│   ├── Alert.tsx
│   ├── EndCallButton.tsx
│   ├── MeetingCard.tsx
│   ├── MeetingRoom.tsx
│   ├── Sidebar.tsx
│   └── ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── sheet.tsx
├── pages
│   ├── index.tsx
│   ├── upcoming.tsx
│   ├── previous.tsx
│   ├── recordings.tsx
│   └── personal-room.tsx
├── public
│   ├── icons
│   └── images
├── .env.local
├── .gitignore
├── package.json
├── README.md
└── next.config.js
```