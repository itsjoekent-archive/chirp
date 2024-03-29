import type { Request, Response } from 'express';
import type { MongoClient, ObjectId } from 'mongodb';
import type { Logger } from 'pino';

export module Chirp {
  // Utilities
  // ---------

  export type UniversalLogger = Logger | Console;

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

  export type ApiToken = {
    value: string;
    expiresAt: string;
  };

  export type ServerChirper = {
    _id: ObjectId;
    avatar?: string;
    bio?: string;
    name: string;
    pronouns: string;
    location?: string;
    handle: string;
    email: string;
    passwordHash: string;
    passwordResetToken?: string;
    apiTokens: ApiToken[];
    isVerified?: boolean;
    suspendedUntil?: string;
    joinedAt: string;
  };

  export type ClientChirper = Omit<
    ServerChirper,
    '_id' | 'email' | 'passwordHash' | 'passwordResetToken' | 'apiTokens'
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

  // API
  // ---

  type HandlerParameters = {
    request: Request;
    response: Response;
    logger: Logger;
    mongoClient: MongoClient;
  };

  export type RequestHandler = (params: HandlerParameters) => Promise<void>;
  export type RequestDefinition = {
    handler: RequestHandler;
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
  };

  export type ErrorApiResponse = {
    error: {
      message: string;
      status: number;
      serverErrorId: string;
    };
  };

  export type DataApiResponse<DataType> =
    | {
        data: DataType;
      }
    | ErrorApiResponse;

  export type PaginatedDataApiResponse<DataType> =
    | {
        data: DataType[];
        pagination: {
          lastId: string;
        };
      }
    | ErrorApiResponse;

  export type PostChirperRequestBody = {
    name: string;
    pronouns: string;
    handle: string;
    email: string;
    password: string;
  };

  export type PostChirperResponse = DataApiResponse<{
    chirper: ClientChirper;
    auth: ApiToken;
  }>;
}
