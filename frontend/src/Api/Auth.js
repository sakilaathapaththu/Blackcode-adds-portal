// src/Api/Auth.js
import http from "../Utils/http";

/** Register a user (role forced to "user") */
export async function registerUser(payload) {
  const body = { ...payload, role: "user" };
  const { data } = await http.post("/auth/register", body);
  return data; // { message, token?, user }
}

/** Login with username OR phone via a single identifier field */
export async function loginUser({ identifier, password }) {
  const { data } = await http.post("/auth/login", {
    usernameOrPhone: String(identifier).trim(),
    password,
  });
  return data; // { message, token, user }
}

/** Convenience: login using username explicitly */
export async function loginWithUsername(username, password) {
  return loginUser({ identifier: username, password });
}

/** Convenience: login using phone explicitly */
export async function loginWithPhone(phone, password) {
  return loginUser({ identifier: phone, password });
}

// src/Api/Auth.js (append)
export async function googleLogin(idToken) {
  const { data } = await http.post("/auth/google", { idToken });
  return data; // { message, token, user }
}
