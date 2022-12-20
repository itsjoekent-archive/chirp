import { Chirp } from '@chirp/types/shared/chirp';

export function transformChirper(chirper: Chirp.ServerChirper): Chirp.ClientChirper {
  const { 
    avatar, 
    bio, 
    name, 
    pronouns, 
    location, 
    handle, 
    isVerified, 
    suspendedUntil, 
    joinedAt,
  } = chirper;

  return {
    id: chirper._id.toString(),
    avatar,
    bio,
    name,
    pronouns,
    location,
    handle,
    isVerified,
    suspendedUntil,
    joinedAt,
  };
}
