import formatsToJSON from './utils/formatsToJSON.js';
import getInputFormats from './utils/getInputFormats.js';
import getOutputFormats from './utils/getOutputFormats.js';

export default function outputFormats(fastify) {
  fastify.get(
    '/v1/formats',
    {
      schema: {
        summary: 'List of input and output formats',
        description: 'Get the list of all the allowed input and output formats',
      },
    },
    (request, response) => {
      response.send({
        result: {
          input: formatsToJSON(getInputFormats()),
          output: formatsToJSON(getOutputFormats()),
        },
        logs: '',
      });
    },
  );
}
