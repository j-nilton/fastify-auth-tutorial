import jwt from "jsonwebtoken";
import { redis } from "../db/clienteRedis";
import { User } from "../types/User";

const ACCESS_SECRET = "segredo";
const REFRESH_SECRET = "refresh-secreto";

export function generateAccessToken(user: User) {
  return jwt.sign(
    { id: user.id, email: user.email },
    ACCESS_SECRET,
    { expiresIn: "30s" }
  );
}

export function generateRefreshToken(user: User) {
  return jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: "10m" }
  );
}

export async function saveTokenInCache(
  userId: number,
  token: string,
  ttl: number
) {
  await redis.set(`session:${userId}`, token, "EX", ttl);
}

export async function getTokenFromCache(userId: number) {
  return redis.get(`session:${userId}`);
}

export async function deleteTokenFromCache(userId: number) {
  await redis.del(`session:${userId}`);
}
