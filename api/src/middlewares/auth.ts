import { auth } from 'express-oauth2-jwt-bearer';

const authenticate = auth({
  authRequired: true,
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_AUDIENCE,
  tokenSigningAlg: 'RS256',
});

export default authenticate;
