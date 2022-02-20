interface JWTConstants {
  secret: string;
  expiresIn: string;
}
export const JWTCONSTANTS: JWTConstants = {
  secret: 'wzx_secret',
  expiresIn: '60s',
};
