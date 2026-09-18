import { Router } from "express";
import {
  getPublicInvitation,
  submitRsvp,
  getWishes,
  submitWish,
  getPublicSystemSettings,
} from "../controllers/public.controller";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware";

const router = Router();

router.get("/invitations/:slug", getPublicInvitation);
router.post("/rsvp", rateLimitMiddleware("submit_rsvp", 10, 300), submitRsvp);
router.get("/wishes", rateLimitMiddleware("get_wishes", 60, 60), getWishes);
router.post("/wishes", rateLimitMiddleware("submit_wish", 5, 60), submitWish);
router.get("/settings", getPublicSystemSettings);

export default router;
