import { Router } from "express";
import indexCtrl from "../controllers/indexCtrl";
import auth from "../helpers/auth";

const router = Router();

router.get("/", auth.verifyToken, indexCtrl.orderCtrl.findAll);
router.post("/", auth.verifyToken, indexCtrl.orderCtrl.create);

export default router;