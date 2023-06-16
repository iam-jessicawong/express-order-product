import { Router } from "express";
import indexCtrl from "../controllers/indexCtrl"

const router = Router();

router.post("/signup", indexCtrl.userCtrl.signUp);
router.post("/signin", indexCtrl.userCtrl.signIn);

export default router;