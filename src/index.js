import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifySensible from '@fastify/sensible';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyPkg from 'fastify';

import v1 from './v1/v1.js';

const PORT = Number(process.env.PORT ?? 20808);
const HOST = process.env.HOST ?? '0.0.0.0';

const fastify = fastifyPkg({
  logger: false,
});

await fastify.register(fastifyCors, {
  maxAge: 86400,
});

await fastify.register(fastifyMultipart, { attachFieldsToBody: true });

await fastify.register(fastifySensible);

fastify.get('/', (_, reply) => {
  reply.redirect('/documentation');
});

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

fastify.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(`Server listening at ${address}`);
});
