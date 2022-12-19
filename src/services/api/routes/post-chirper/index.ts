const handler: Chirp.RequestHandler = async ({ request, response, mongoClient }) => {
  
  // TODO: validate 
  // TODO: create DB model
  // TODO: transform & return response

  response.status(200).json({ ok: true });
};

const definition: Chirp.RequestDefinition = { handler, method: 'post', path: '/chirper' };
export default definition;
