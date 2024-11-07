import express from "express";
import { createLocation, getAllLocations, updateLocation, deleteLocation, updateLocationStatus } from '../Controllers/locationController.js';
const router = express.Router();

router.post("/createlocation", createLocation);
router.get("/getlocation", getAllLocations);
router.post("/update/:id", updateLocation);
router.delete("/delete/:id", deleteLocation);
router.patch("/updateStatus/:id", updateLocationStatus); // update 30/10/2024

export default router;