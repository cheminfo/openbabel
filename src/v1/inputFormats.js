import formatsToJSON from './utils/formatsToJSON.js';
import getInputFormats from './utils/getInputFormats.js';

export default function inputFormats(fastify) {
  fastify.route({
    url: '/v1/inputFormats',
    method: ['GET', 'POST'],
    handler: getFormats,
    schema: {
      summary: 'List of input formats',
      description: 'Get the list of all the allowed input formats',
    },
  });
}

function getFormats(request, response) {
  response.send({ result: formatsToJSON(getInputFormats()), log: '' });
}
