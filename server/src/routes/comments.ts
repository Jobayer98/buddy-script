import { Router } from "express";
import { body, query } from "express-validator";
import { verifyJWT } from "../middleware/auth";
import { getComments, addComment, deleteComment } from "../controllers/comments.controller";

const router = Router();

router.get(
  "/",
  verifyJWT,
  [query("postId").notEmpty().withMessage("postId is required")],
  getComments
);

router.post(
  "/",
  verifyJWT,
  [
    body("postId").notEmpty().withMessage("postId is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("parentId").optional({ nullable: true }).isMongoId().withMessage("Invalid parentId"),
  ],
  addComment
);

router.delete("/:id", verifyJWT, deleteComment);

export default router;
