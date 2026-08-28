import { authApi } from "./axios";

interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
}

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  try {
    const res = await authApi.post("/api/users/signin/", {
      username,
      password,
    });

    const { access, refresh } = res.data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("username", username);

    return res.data;

  } catch (error: any) {
    console.error(error);

    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Invalid username or password.";

    throw new Error(message);
  }
}