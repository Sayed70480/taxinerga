import axios from "axios";

export default async function BOG_GetBussinesToken() {
  const client_id = process.env.BOG_CLIENT_ID;
  const client_secret = process.env.BOG_CLIENT_SECRET;
  const base64string = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const response = await axios.post("https://account.bog.ge/auth/realms/bog/protocol/openid-connect/token", new URLSearchParams({ grant_type: "client_credentials" }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64string}`,
      },
    });
    return response.data.access_token as string;
  } catch (error) {
    console.error("Error fetching BOG token:", error);
    return null;
  }
}
