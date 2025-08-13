import { Router, Request, Response } from "express";
import { verifyToken, AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/User";
import redisClient from "../utils/redisClient";

const router = Router();

router.get("/profile", verifyToken, async (req: AuthRequest, res: Response) => {
const cacheKey = `user:${req.userId}:profile`;

  try {
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userData = user.toJSON();

    // Cache data for 60 seconds
    await redisClient.setEx(cacheKey, 60, JSON.stringify(userData));

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
