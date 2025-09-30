import * as jose from 'jose';

const JWKS_URL = 'https://api-auth.web3auth.io/.well-known/jwks.json';
const jwks = jose.createRemoteJWKSet(new URL(JWKS_URL));
const WEB3AUTH_EXPECTED_AUD = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID; // optional strictness
const WEB3AUTH_EXPECTED_ISS = 'https://api-auth.web3auth.io';

export interface VerifiedJWT {
  token?: string;
  payload?: any; // Shape depends on Web3Auth provider
}

export async function extractAndVerifyJWT(req: Request): Promise<VerifiedJWT> {
  const authHeader = req.headers.get('authorization');
  let token = authHeader?.split(' ')[1];
  if (!token) {
    const cookie = req.headers.get('cookie');
    if (cookie) {
      const cookies = cookie.split(';').reduce((acc: Record<string,string>, pair) => {
        const [k,v] = pair.trim().split('='); acc[k]=v; return acc; }, {});
      token = cookies.web3auth_token;
    }
  }
  if (!token) return { token: undefined, payload: undefined };
  const { payload } = await jose.jwtVerify(token, jwks, {
    algorithms: ['ES256'],
    issuer: WEB3AUTH_EXPECTED_ISS,
    audience: WEB3AUTH_EXPECTED_AUD ? WEB3AUTH_EXPECTED_AUD : undefined,
  });
  return { token, payload };
}
