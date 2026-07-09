import getInputFormats from './utils/getInputFormats.js';
import getOutputFormats from './utils/getOutputFormats.js';
import runBabel from './utils/runBabel.js';

export default function convert(fastify) {
  fastify.route({
    url: '/v1/convert',
    method: ['GET', 'POST'],
    handler: doConvert,
    schema: {
      summary: 'Convert chemical file formats',
      description:
        'Convert between various chemical file formats using OpenBabel',
      consumes: ['multipart/form-data'],
      querystring: {
        type: 'object',
        properties: {
          input: {
            description: 'Input file',
            format: 'binary',
          },
          inputFormat: {
            description: 'Input format',
            type: 'string',
            enum: getInputFormats(),
          },
          outputFormat: {
            description: 'Output format',
            type: 'string',
            enum: getOutputFormats(),
          },
          hydrogens: {
            description:
              'Specify if hydrogens should not be touched (leave empty), deleted or added',
            type: 'string',
            enum: ['', 'Delete', 'Add'],
          },
          coordinates: {
            description:
              'Specify if 3D coordinates should not be touched (leave empty), calculate for 2D or 3D',
            type: 'string',
            enum: ['', '2D', '3D'],
          },
          ph: {
            description:
              'pH at which the molecule should be protonated, leave empty for no change',
            type: 'string',
          },
        },
      },
    },
  });
}

async function doConvert(request, response) {
  const params = request.body || request.query;

  for (const key in params) {
    if (params[key].value) {
      params[key] = params[key].value;
    }
  }

  const flags = [];
  if (params.hydrogens && params.hydrogens === 'Delete') flags.push('-d');
  if (params.hydrogens && params.hydrogens === 'Add') flags.push('-h');
  if (params.ph) flags.push(`-p ${params.ph}`);
  if (params.coordinates && params.coordinates === '2D') flags.push('--gen2D');
  if (params.coordinates && params.coordinates === '3D') flags.push('--gen3D');
  flags.push(
    `-i${params.inputFormat.replace(/ .*/, '')}`,
    `-o${params.outputFormat.replace(/ .*/, '')}`,
  );

  try {
    const { stdout, stderr } = await runBabel(flags, params.input);
    response.send({ result: stdout, log: stderr });
  } catch (error) {
    if (error.statusCode) throw error;
    response.send({ result: '', log: String(error) });
  }
}
