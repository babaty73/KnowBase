import { Router } from "express";
import { askQuestion } from "../controllers/questionController.js";

const router = Router();

router.post("/", askQuestion);

export default router;