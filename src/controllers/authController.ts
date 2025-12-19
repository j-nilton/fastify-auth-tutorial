import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import users from "../user.json";
import { User } from "../types/User";

import {
  generateAccessToken,
  generateRefreshToken,
  saveTokenInCache,
  getTokenFromCache,
  deleteTokenFromCache
} from "../services/tokenServices";

const ACCESS_SECRET = "segredo";
const REFRESH_SECRET = "refresh-secreto";


export async function loginProfissional(req: FastifyRequest, reply: FastifyReply) {
 const { email, password } = req.body as { email: string; password: string };


 const user = (users as User[]).find(u => u.email === email);
 if (!user) return reply.code(401).send({ error: "Credenciais inválidas" });


 if (password !== "123456")
  return reply.code(401).send({ error: "Senha incorreta" });


 const accessToken = generateAccessToken(user);
 const refreshToken = generateRefreshToken(user);


 await saveTokenInCache(user.id, accessToken, 30);


 return reply.send({ accessToken, refreshToken });
}


export async function protectedProfissional(req: FastifyRequest, reply: FastifyReply) {
 const auth = req.headers.authorization;


 if (!auth) return reply.code(401).send({ error: "Sem token" });


 const token = auth.replace("Bearer ", "");


 try {
   const decoded = jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;


   const cached = await getTokenFromCache(decoded.id);
   if (cached !== token)
     return reply.code(401).send({ error: "Token expirado no cache" });


   return reply.send({ message: "Acesso autorizado", user: decoded });


 } catch (err) {
   return reply.code(401).send({ error: "Token inválido ou expirado" });
 }
}


export async function refresh(req: FastifyRequest, reply: FastifyReply) {
  const { refreshToken } = req.body as { refreshToken: string };

  if (!refreshToken)
    return reply.code(400).send({ error: "Refresh token ausente" });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as jwt.JwtPayload;

    const user = (users as User[]).find(u => u.id === decoded.id);
    if (!user)
      return reply.code(401).send({ error: "Usuário não encontrado" });

    const newAccessToken = generateAccessToken(user);
    await saveTokenInCache(user.id, newAccessToken, 30);

    return reply.send({ accessToken: newAccessToken });

  } catch {
    return reply.code(401).send({ error: "Refresh token inválido ou expirado" });
  }
}

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  const auth = req.headers.authorization;

  if (!auth)
    return reply.code(401).send({ error: "Token ausente" });

  const token = auth.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;
    await deleteTokenFromCache(decoded.id);

    return reply.send({ message: "Logout realizado com sucesso" });

  } catch {
    return reply.code(401).send({ error: "Token inválido" });
  }
}
