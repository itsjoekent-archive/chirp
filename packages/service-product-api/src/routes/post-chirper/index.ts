import {
  bcrypt,
  createApiError,
  createApiToken,
  documentTransformers,
  fieldValidationGroups,
  getLanguageFromRequest,
  validateRequestBody,
} from '@chirp/lib-node';
import { copy, fieldPreprocessors } from '@chirp/lib-utils';
import { Chirp } from '@chirp/types';

const handler: Chirp.RequestHandler = async ({
  request,
  response,
  logger,
  mongoClient,
}) => {
  const postChirperRequestBody =
    await validateRequestBody<Chirp.PostChirperRequestBody>(
      request,
      mongoClient,
      logger,
      [
        ...fieldValidationGroups.email,
        ...fieldValidationGroups.handle,
        ...fieldValidationGroups.name,
        ...fieldValidationGroups.pronouns,
        ...fieldValidationGroups.password,
      ]
    );

  const postChirperRequestProcessed: Chirp.PostChirperRequestBody = {
    ...postChirperRequestBody,
    handle: fieldPreprocessors.preprocessHandle(postChirperRequestBody.handle),
    name: fieldPreprocessors.preprocessName(postChirperRequestBody.name),
    pronouns: fieldPreprocessors.preprocessPronouns(postChirperRequestBody.pronouns),
    email: fieldPreprocessors.preprocessEmail(postChirperRequestBody.email),
  };

  const { password, ...insertionFields } = postChirperRequestProcessed;
  const hashedPassword = await bcrypt.hashPassword(password);

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
  const document = await collection.findOne<Chirp.ServerChirper>({
    _id: insertedId,
  });

  if (!document) {
    throw createApiError(copy.genericServerError[getLanguageFromRequest(request)]());
  }

  const clientChirper = documentTransformers.transformChirper(document);
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

const definition: Chirp.RequestDefinition = {
  handler,
  method: 'post',
  path: '/chirper',
};
export default definition;
