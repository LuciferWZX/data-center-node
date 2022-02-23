interface JWTConstants {
  secret: string;
  expiresIn: string;
}
export const ExpiresInSeconds = 60 * 30;
export const JWT_CONSTANTS: JWTConstants = {
  secret: 'wzx_secret',
  expiresIn: `${ExpiresInSeconds}s`,
};
