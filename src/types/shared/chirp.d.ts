import type { ObjectId } from 'mongodb';

declare module 'Chirp' {

  // Data models
  // ------

  export type ChirpAttachment = {
    id: string;
    type:
      | 'IMAGE'
      | 'VIDEO'
      | 'LINK'
      | 'POLL'
      | 'HASHTAG'
      | 'AUTO_DELETE'
      | 'GIF';
  };

  export type ImageChirpAttachment = {
    type: 'IMAGE';
    src: string;
    alt: string;
  };

  export type ServerChirp = {
    _id: ObjectId;
    postedBy: {
      id: ObjectId;
      type: 'CHIRPER' | 'BIRD_FEEDER';
    };
    inReplyTo: ObjectId | null;
    quoting: ObjectId | null;
    reposted: ObjectId | null;
    content: string;
    attachments: ChirpAttachment[];
    postedAt: string;
    reactionCounts: {
      [emoji: string]: number;
    };
    moderationStatus: 'PUBLIC' | 'UNDER_REVIEW' | 'REMOVED';
    moderationJury: ObjectId | null;
  };

  export type ClientChirp = Omit<ServerChirp, '_id' | 'moderationJury'> & {
    id: string;
    postedBy: { type: ServerChirp['postedBy']['type'] } & (
      | ClientChirper
      | ClientBirdFeeder
    );
    inReplyTo: ClientChirp | null;
    quoting: ClientChirp | null;
    reposted: ClientChirp | null;
  };

  export type ServerChirper = {
    _id: ObjectId;
    avatar: string;
    bio: string;
    pronouns: string;
    location: string;
    handle: string;
    email: string;
    passwordHash: string;
    passwordResetToken: string;
    apiTokens: [
      {
        token: string;
        expiresAt: string;
      }
    ];
    isVerified: boolean;
    suspendedUntil: string;
    joinedAt: string;
  };

  export type ClientChirper = Omit<
    ServerChirper,
    '_id' | 'passwordHash' | 'passwordResetToken' | 'apiTokens'
  > & {
    id: string;
  };

  export type ServerBirdFeeder = {
    _id: ObjectId;
    name: string;
    avatar: string;
    sourceUrl: string;
    lastChecked: string;
  };

  export type ClientBirdFeeder = Omit<
    ServerBirdFeeder,
    '_id' | 'lastChecked' | 'sourceUrl'
  > & {
    id: string;
  };
};
