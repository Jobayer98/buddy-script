import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User";

const ACCESS_EXPIRY = "5m";
const ACCESS_EXPIRY_SECONDS = 5 * 60;
const REFRESH_EXPIRY = "7d";
const REFRESH_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const signAccess = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: ACCESS_EXPIRY });

const signRefresh = (id: string) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: REFRESH_EXPIRY });

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: REFRESH_EXPIRY_MS,
  });
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken");
};

const formatUser = (user: InstanceType<typeof User>) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
});

export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return;
  }

  const { firstName, lastName, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashed });

  const accessToken = signAccess(user._id.toString());
  const refreshToken = signRefresh(user._id.toString());

  setRefreshCookie(res, refreshToken);
  res.status(201).json({ accessToken, expiresIn: ACCESS_EXPIRY_SECONDS, user: formatUser(user) });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const accessToken = signAccess(user._id.toString());
  const refreshToken = signRefresh(user._id.toString());

  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, expiresIn: ACCESS_EXPIRY_SECONDS, user: formatUser(user) });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401).json({ message: "No refresh token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const accessToken = signAccess(user._id.toString());
    const newRefreshToken = signRefresh(user._id.toString());

    setRefreshCookie(res, newRefreshToken);
    res.json({ accessToken, expiresIn: ACCESS_EXPIRY_SECONDS, user: formatUser(user) });
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const logout = (_req: Request, res: Response): void => {
  clearRefreshCookie(res);
  res.json({ message: "Logged out" });
};
