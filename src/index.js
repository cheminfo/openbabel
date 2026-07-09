import buildApp from './app.js';

const PORT = Number(process.env.PORT ?? 20808);
const HOST = process.env.HOST ?? '0.0.0.0';

const fastify = await buildApp();

const address = await fastify.listen({ port: PORT, host: HOST });
// eslint-disable-next-line no-console
console.log(`Server listening at ${address}`);
