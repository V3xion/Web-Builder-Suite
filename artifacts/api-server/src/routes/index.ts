import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import productsRouter from "./products";
import reviewsRouter from "./reviews";
import messagesRouter from "./messages";
import settingsRouter from "./settings";
import adminRouter from "./admin";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(productsRouter);
router.use(reviewsRouter);
router.use(messagesRouter);
router.use(settingsRouter);
router.use(adminRouter);

export default router;
