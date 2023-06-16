import { Router } from "express";
import indexCtrl from "../controllers/indexCtrl";
import middleware from "../middleware/upload";

const router = Router();

router.get("/", indexCtrl.productCtrl.findAll);
router.get("/:id", indexCtrl.productCtrl.findOne);
router.post("/", middleware.upload, indexCtrl.productCtrl.create);

export default router;