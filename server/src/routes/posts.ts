import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import { verifyJWT } from "../middleware/auth";
import { getFeed, createPost, updatePost, deletePost } from "../controllers/posts.controller";

const router = Router();

// Use memory storage for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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
