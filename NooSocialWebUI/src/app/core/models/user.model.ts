export interface User {
  //email: string;
  token: string;
  //username: string;
  bio: string;
  avatar: string;

  sub: string,
  email_verified: boolean,
  iss: string,
  username: string,
  "cognito:username": '',
  locale: string,
  origin_jti: string,
  aud: string,
  event_id: string,
  token_use: string,
  auth_time: number,
  nickname: string,
  exp: number,
  iat: number,
  jti: string,
  email: string
}
