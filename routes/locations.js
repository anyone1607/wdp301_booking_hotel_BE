import express from "express";
import { createLocation, getAllLocations, updateLocation, deleteLocation } from '../Controllers/locationController.js';
const router = express.Router();

router.post("/createlocation", createLocation);
router.get("/getlocation", getAllLocations);
router.post("/:id", updateLocation);
router.delete("/delete/:id", deleteLocation);

export default router;