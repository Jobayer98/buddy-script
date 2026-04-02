import { Router } from "express";
import { body } from "express-validator";
import { verifyJWT } from "../middleware/auth";
import { toggleLike } from "../controllers/likes.controller";

const router = Router();

router.post(
  "/toggle",
  verifyJWT,
  [
    body("postId").optional({ nullable: true }).isMongoId().withMessage("Invalid postId"),
    body("commentId").optional({ nullable: true }).isMongoId().withMessage("Invalid commentId"),
  ],
  toggleLike
);

export default router;
