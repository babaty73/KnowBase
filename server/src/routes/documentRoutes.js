import { Router } from "express";
import {
  getDocuments,
  getDocument,
  createDocument,
  deleteDocument,
} from "../controllers/documentController.js";

const router = Router();

router.get("/", getDocuments);
router.get("/:id", getDocument);
router.post("/", createDocument);
router.delete("/:id", deleteDocument);

export default router;
