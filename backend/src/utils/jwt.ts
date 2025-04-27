import jwt from 'jsonwebtoken';

// No usamos promisify directamente, hacemos nuestra propia función async
export const generateToken = async (
  payload: Record<string, unknown>,
  secret: string,
  options?: jwt.SignOptions
): Promise<string> => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async (
  token: string,
  secret: string
): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as jwt.JwtPayload);
      }
    });
  });
};
