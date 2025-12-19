import Fastify from "fastify";
import cors from "@fastify/cors";
import authRoutes from "./routes/authRoutes";

const app = Fastify({ logger: true });

app.register(cors);

app.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  app.getDefaultJsonParser("ignore", "ignore")
);

// Rota GET /
app.get("/", async (request, reply) => {
 return { message: "API funcionando corretamente!" };
});
app.register(authRoutes);

app.listen({ port: 3000 })
 .then(() => console.log("Servidor rodando na porta 3000"))
 .catch(err => {
   console.error(err);
   process.exit(1);
 });
 
