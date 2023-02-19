import express from "express";
import { createReport, deleteReport, getAllReports, getReport } from "../controllers/report.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE new report
router.post("/",verifyUser, createReport);

//GET  report
router.get("/:id",verifyUser, getReport);

//GET ALL reports
router.get("/:",verifyUser, getAllReports);

//DELETE  report
router.delete("/:id",verifyUser, deleteReport);


export default router