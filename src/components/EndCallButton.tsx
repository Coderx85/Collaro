'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );

  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#participant-state-3
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  useEffect(() => {
    const endCallForEveryone = async () => {
      await fetch('/api/call/end', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: call.id,
        }),
      });
    };

    if (isMeetingOwner) {
      endCallForEveryone();
    }
  }, [call.id, isMeetingOwner]);
 
  const endCall = async () => {
    await call.endCall();
    router.push('/');
  };

  return (
    <Button onClick={endCall} className="bg-red-500">
      End call for everyone
    </Button>
  );
};

export default EndCallButton;
