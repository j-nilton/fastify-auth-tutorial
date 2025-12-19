# API de Autenticação – Fastify, JWT e Redis

## Visão Geral

API REST para autenticação de profissionais, implementando um fluxo completo com **JWT (Access + Refresh Token)** e **Redis** para controle de sessão com TTL. O projeto tem foco acadêmico e segue práticas utilizadas em sistemas corporativos.

---

## Tecnologias

* Node.js
* Fastify
* TypeScript
* JWT (jsonwebtoken)
* Redis (via Docker)
* Thunder Client / Postman

---

## Pré-requisitos

* Node.js ≥ 18
* Docker
* npm

Verificação:

```bash
node -v
docker -v
npm -v
```

---

## Instalação das Dependências

Na raiz do projeto:

```bash
npm install
```

---

## Subindo o Redis

```bash
docker run -d --name redis-auth -p 6379:6379 redis
```

---

## Executando a API

Execute:

```bash
npm run dev
```

---

## Endpoints

### Login

`POST /auth/login`

```json
{ "email": "aluno@ifpi.edu.br", "password": "123456" }
```

### Rota Protegida

`GET /auth/protected`

```
Authorization: Bearer ACCESS_TOKEN
```

### Refresh Token

`POST /auth/refresh`

```json
{ "refreshToken": "REFRESH_TOKEN" }
```

### Logout

`POST /auth/logout`

```
Authorization: Bearer ACCESS_TOKEN
```

---

## Fluxo de Autenticação (Resumo)

1. Login gera Access e Refresh Token
2. Access Token é salvo no Redis com TTL
3. Rotas protegidas validam JWT + Redis
4. Refresh gera novo Access Token
5. Logout remove a sessão do Redis
