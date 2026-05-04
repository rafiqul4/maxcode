import { Hono } from "hono";
import { getHealth } from "../controllers/healthController.js";

const healthRouter = new Hono();

healthRouter.get("/", getHealth);

export default healthRouter;
