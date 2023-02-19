import report from "../models/report.js"


//CREATE Report
export const createReport = async (req, res, next) => {
    const newReport = new report(req.body);
    try {
      const savedReport = await newReport.save();
      res.status(200).json(savedReport);
    } catch (err) {
      next(err);
    }
  };

//GET Report
export const getReport = async (req, res, next) => {
    try {
      const Report = await report.findById(req.params.id);
      res.status(200).json(Report);
    } catch (err) {
      next(err);
    }
  };

  //GET All Reports
export const getAllReports = async (req, res, next) => {
    try {
      const Reports = await report.find();
      res.status(200).json(Reports);
    } catch (err) {
      next(err);
    }
  };

  //DELETE Report
export const deleteReport = async (req, res, next) => {
    const ReportId = req.params.id
    try {
      await report.findByIdAndDelete(ReportId);
      res.status(200).json("Report has been deleted");
    } catch (err) {
      next(err);
    }
  };