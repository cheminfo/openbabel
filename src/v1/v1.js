import convert from './convert.js';
import formats from './formats.js';
import inputFormats from './inputFormats.js';
import outputFormats from './outputFormats.js';

export default async function v1(fastify) {
  convert(fastify);
  inputFormats(fastify);
  outputFormats(fastify);
  formats(fastify);
}
