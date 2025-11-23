import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client("TU_CLIENT_ID.apps.googleusercontent.com");

export async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: "TU_CLIENT_ID.apps.googleusercontent.com"
  });

  const payload = ticket.getPayload();
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture
  };
}
