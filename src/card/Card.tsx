import React, { useEffect, useState } from 'react';

import { Profile } from './Profile';
import { AvatarStatusMobile, AvatarStatusRound, StatusDnd, StatusIdle, StatusOffline, StatusOnline, StatusOnlineMobile, ActivityImage } from './Masks';

import { lanyard } from './lanyard';
import { UserProfile } from './types/dcdn';
import { LanyardPresence } from './types/lanyard';

interface CardProps {
  id: string;
}

export function Card({ id }: CardProps) {
  const [profile, setProfile] = useState<UserProfile>();
  const [user, setUser] = useState<LanyardPresence>();

  async function fetchProfileAndUser(id: string) {
    const user = await fetch(`https://api.lanyard.rest/v1/users/${id}`).then((r) => r.json());
    const profile = await fetch(`https://dcdn.dstn.to/profile/${id}`).then((r) => r.json());

    setProfile(profile);
    setUser(user.data);
  }

  async function presenceChange(presence: LanyardPresence, id: string) {
    if (presence.discord_user.id == id) {
      setUser(presence);

      const profile = await fetch(`https://dcdn.dstn.to/profile/${id}`).then((r) => r.json());
      setProfile(profile);
    }
  }

  useEffect(() => {
    if (id) {
      fetchProfileAndUser(id as string);

      lanyard.on('presence', (presence) => presenceChange(presence, id as string));

      return () => {
        lanyard.removeListener('presence', (presence) => presenceChange(presence, id as string));
      };
    }
  }, [id]);

  return (
    <>
      <svg viewBox="0 0 1 1" style={{ position: 'absolute', pointerEvents: 'none', top: '-1px', left: '-1px', width: '1px', height: '1px' }} aria-hidden="true">
        <ActivityImage />
        <StatusIdle />
        <StatusOnline />
        <StatusDnd />
        <StatusOffline />
        <AvatarStatusRound />
        <AvatarStatusMobile />
        <StatusOnlineMobile />
      </svg>
      {user && profile && <Profile user={user} profile={profile} />}
    </>
  );
}

export default Card;
