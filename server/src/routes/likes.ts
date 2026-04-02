import { Router } from "express";
import { body } from "express-validator";
import { verifyJWT } from "../middleware/auth";
import { toggleLike, getReactions } from "../controllers/likes.controller";

const router = Router();

router.post(
  "/toggle",
  verifyJWT,
  [
    body("postId").optional({ nullable: true }).isMongoId().withMessage("Invalid postId"),
    body("commentId").optional({ nullable: true }).isMongoId().withMessage("Invalid commentId"),
    body("reactionType").optional().isIn(["like", "love", "haha", "wow", "sad", "angry"]).withMessage("Invalid reaction type"),
  ],
  toggleLike
);

router.get("/", verifyJWT, getReactions);

export default router;
