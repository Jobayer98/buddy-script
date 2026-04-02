import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import path from "path";
import { verifyJWT } from "../middleware/auth";
import { getFeed, createPost, updatePost, deletePost } from "../controllers/posts.controller";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/", verifyJWT, getFeed);

router.post(
  "/",
  verifyJWT,
  upload.single("image"),
  [
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("visibility").optional().isIn(["public", "private"]).withMessage("Visibility must be public or private"),
  ],
  createPost
);

router.patch(
  "/:id",
  verifyJWT,
  [
    body("content").optional().trim().notEmpty().withMessage("Content cannot be empty"),
    body("visibility").optional().isIn(["public", "private"]).withMessage("Visibility must be public or private"),
  ],
  updatePost
);

router.delete("/:id", verifyJWT, deletePost);

export default router;
