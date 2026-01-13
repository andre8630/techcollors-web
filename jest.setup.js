import dotenv from "dotenv";
import path from "path";

// Forçar NODE_ENV para "development"
process.env.NODE_ENV = "development";

// Carregar variáveis do .env.development
dotenv.config({ path: path.resolve(process.cwd(), ".env.development") });
