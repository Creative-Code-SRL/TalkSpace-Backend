//ESTE CODIGO ES SOLAMENTE PARA PROBAR FUNCIONAMIENTO SIN FRONTEND, EL FRONTEND DE ENVIAR EL TOKEN DEL USUARIO (EL QYE ESTA EN LA ULTIMA LINEA)
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "<tu-client-id-aqui>";
const client = new OAuth2Client(CLIENT_ID);

async function verifyToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log("Token válido:", payload);
  } catch (error) {
    console.error("Error verificando token:", error);
  }
}

// Ejemplo de prueba
const testToken = "<coloca-aqui-un-token-valido-de-google>";
verifyToken(testToken);
