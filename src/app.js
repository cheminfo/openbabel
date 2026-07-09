import { existsSync } from 'node:fs';
import { join } from 'node:path';

import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifySensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyPkg from 'fastify';

import v1 from './v1/v1.js';

/**
 * Build the Fastify application with all plugins and routes registered.
 * @returns The configured Fastify instance, ready to listen or inject.
 */
export default async function buildApp() {
  const fastify = fastifyPkg({
    logger: false,
  });

  await fastify.register(fastifyCors, {
    maxAge: 86400,
  });

  await fastify.register(fastifyMultipart, { attachFieldsToBody: true });

  await fastify.register(fastifySensible);

  // Serve the built frontend when available (Docker image and after `npm run build`).
  // In dev without a build, fall back to redirecting to the API documentation.
  const frontendDist = join(import.meta.dirname, '../frontend/dist');
  if (existsSync(frontendDist)) {
    await fastify.register(fastifyStatic, {
      root: frontendDist,
      decorateReply: false,
    });
  } else {
    fastify.get('/', (_, reply) => {
      reply.redirect('/documentation');
    });
  }

  await fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Convert chemical file format using OpenBabel',
        description: '',
        version: '1.0.0',
      },
      produces: ['application/json'],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  });

  await fastify.register(v1);

  await fastify.ready();
  fastify.swagger();

  return fastify;
}
