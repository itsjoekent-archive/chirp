import { hashPassword } from '@chirp/lib/node/bcrypt-wrapper';
import createApiError from '@chirp/lib/node/create-api-error';
import createApiToken from '@chirp/lib/node/create-api-token';
import { transformChirper } from '@chirp/lib/node/document-transformer';
import fieldValidationGroups from '@chirp/lib/node/field-validation-groups';
import getLanguageFromRequest from '@chirp/lib/node/get-language-from-request';
import validateRequestBody from '@chirp/lib/node/validate-request-body';
import { genericServerError } from '@chirp/lib/utils/copy';
import { preprocessEmail, preprocessHandle, preprocessName, preprocessPronouns } from '@chirp/lib/utils/field-preprocessor';
import { Chirp } from '@chirp/types/shared/chirp';

const handler: Chirp.RequestHandler = async ({ request, response, logger, mongoClient }) => {
  const postChirperRequestBody = await validateRequestBody<Chirp.PostChirperRequestBody>(request, mongoClient, logger, [
    ...fieldValidationGroups.email,
    ...fieldValidationGroups.handle,
    ...fieldValidationGroups.name,
    ...fieldValidationGroups.pronouns,
    ...fieldValidationGroups.password,
  ]);

  const postChirperRequestProcessed: Chirp.PostChirperRequestBody = {
    ...postChirperRequestBody,
    handle: preprocessHandle(postChirperRequestBody.handle),
    name: preprocessName(postChirperRequestBody.name),
    pronouns: preprocessPronouns(postChirperRequestBody.pronouns),
    email: preprocessEmail(postChirperRequestBody.email),
  };

  const { password, ...insertionFields } = postChirperRequestProcessed;
  const hashedPassword = await hashPassword(password);

  const token = createApiToken();

  const toInsert: Omit<Chirp.ServerChirper, '_id'> = {
    ...insertionFields,
    passwordHash: hashedPassword,
    apiTokens: [token],
    joinedAt: new Date().toUTCString(),
  };

  const database = mongoClient.db('chirp');
  const collection = database.collection('chirpers');

  const { insertedId } = await collection.insertOne(toInsert);
  const document = await collection.findOne<Chirp.ServerChirper>({ _id: insertedId });

  if (!document) {
    throw createApiError(genericServerError[getLanguageFromRequest(request)]());
  }

  const clientChirper = transformChirper(document);
  const responseData: Chirp.PostChirperResponse = {
    data: {
      chirper: clientChirper,
      auth: token,
    },
  };

  response
    .status(200)
    .cookie('authorization', `${clientChirper.id}.${token.value}`)
    .json(responseData);
};

const definition: Chirp.RequestDefinition = { handler, method: 'post', path: '/chirper' };
export default definition;
