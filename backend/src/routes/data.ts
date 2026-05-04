import { Hono } from "hono";
import { getSampleData } from "../controllers/dataController.js";

const dataRouter = new Hono();

dataRouter.get("/", getSampleData);

export default dataRouter;