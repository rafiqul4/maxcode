import { Hono } from "hono";
import { getSearchResults } from "../controllers/searchController.js";

const searchRouter = new Hono();

searchRouter.get("/", getSearchResults);

export default searchRouter;
