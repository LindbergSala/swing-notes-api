import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import httpErrorHandler from '@middy/http-error-handler';
import { createAccountSchema } from '../middlewares/schemas/Index.mjs';

const lambdaHandler = async (event) => {
  // Efter jsonBodyParser är event.body redan ett objekt.
  const account = event.body; // { username, email, password }

  // Här skulle du normalt skapa konto i DB osv.
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, account })
  };
};

export const handler = middy()
  .use(jsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(createAccountSchema) }))
  .use(httpErrorHandler())
  .handler(lambdaHandler);
