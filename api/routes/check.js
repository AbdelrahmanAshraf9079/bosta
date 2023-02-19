import express from "express";
import {
  createCheck,
  deleteCheck,
  getCheck,
  updateCheck,
} from "../controllers/check.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("checks");
});

//CREATE Check
router.post("/",verifyUser, createCheck);

//UPDATE Check
router.put("/:id",verifyUser, updateCheck);

//DELETE Check
router.delete("/:id",verifyUser, deleteCheck);

//GET Check
router.get("/:id",verifyUser, getCheck);

// //GET check : check ? by tags
// router.get("/",)

export default router;
