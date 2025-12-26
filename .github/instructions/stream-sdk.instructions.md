# Stream SDK Integration Guide

This document outlines how the **Stream Video SDK** is integrated into the project to power video calling and meeting functionality.

---

## 1. Overview & Architecture

The project uses `@stream-io/video-react-sdk` for the frontend UI and `@stream-io/node-sdk` for server-side token generation.

**Key Components:**
- **Provider**: `StreamClientProvider` (Client Component) - Initializes the `StreamVideoClient`.
- **Server Action**: `tokenProvider` (Server Action) - Generates secure authentication tokens.
- **Meeting Flow**:
  1.  **Setup Screen** (`MeetingSetup`): Preview camera/mic before joining.
  2.  **Meeting Room** (`MeetingRoom`): The active call interface with controls and participant grid.

---

## 2. Configuration & Setup

### **Environment Variables**
Ensure these are set in your `.env` file:
```env
NEXT_PUBLIC_STREAM_API_KEY=your_api_key
STREAM_SECRET_KEY=your_secret_key
```

### **Provider Implementation**
Located at `@src/providers/StreamClientProvider.tsx`.
- Wraps the application (or specific routes) with `<StreamVideo client={...}>`.
- **Logic**:
  1.  Checks for an authenticated user session.
  2.  Calls the server-side `tokenProvider` to get a token.
  3.  Initializes `StreamVideoClient` with the API key, user details, and token.

---

## 3. Server-Side Authentication

### **Token Generation**
Located at `@src/action/stream.action.ts`.
- **Function**: `tokenProvider()`
- **Workflow**:
  1.  Validates the current user session using `better-auth`.
  2.  Uses the `StreamClient` from `@stream-io/node-sdk` (initialized with the secret key).
  3.  Generates a user token (`streamClient.generateUserToken`) with an expiration time (1 hour).
  4.  Returns the token to the client.

---

## 4. UI Components & Usage

### **Meeting Setup (`@src/components/MeetingSetup.tsx`)**
- **Purpose**: Pre-call check.
- **Key Features**:
  - `VideoPreview`: Shows the camera feed.
  - `DeviceSettings`: Allows selecting camera/microphone sources.
  - **Logic**:
    - Toggles camera/mic on/off.
    - Checks if the call has started or ended using `useCallStateHooks`.
    - Joins the call via `call.join()` upon confirmation.

### **Meeting Room (`@src/components/MeetingRoom.tsx`)**
- **Purpose**: The actual video call interface.
- **Key SDK Components**:
  - `PaginatedGridLayout` / `SpeakerLayout`: Renders participant video feeds.
  - `CallControls`: Standard buttons (mute, video off, leave).
  - `CallParticipantsList`: Sidebar showing who is in the call.
  - `CallStatsButton`: Network and call quality stats.
- **State Management**:
  - `useCallCallingState()`: Ensures the user has actively `JOINED` before rendering the room.
  - `useCallStateHooks()`: Access call metadata.

### **Meeting Type List (`@src/components/MeetingTypeList.tsx`)**
- Orchestrates the creation of meetings (Instant, Scheduled, Joining via link).
- Uses `client.call('default', 'random-id')` to initialize new call instances.

---

## 5. Typical Workflow for a New Page

If you need to add video capability to a new page:

1.  **Ensure Context**: The page must be a child of `StreamVideoProvider`.
    - *Note:* `src/app/(root)/(dashboard)/workspace/[slug]/layout.tsx` already handles this for workspace routes.
2.  **Create/Get Call**:
    ```tsx
    const client = useStreamVideoClient();
    const call = client.call('default', 'unique-call-id');
    await call.join({ create: true });
    ```
3.  **Render UI**:
    Wrap the UI in `<StreamCall call={call}>`:
    ```tsx
    <StreamCall call={call}>
       {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
       ) : (
          <MeetingRoom />
       )}
    </StreamCall>
    ```

---

## 6. Dependencies

- **@stream-io/video-react-sdk**: Core React components and hooks.
- **@stream-io/node-sdk**: Server-side SDK for token generation.
