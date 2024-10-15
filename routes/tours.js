import express from 'express'
import { createTour, deleteTour, getAllTour, getFeaturedTour, getSingleTour, getTourBySearch, getTourCount, updateTour, getToursByCity } from '../Controllers/tourControllers.js'

import { verifyAdmin } from '../utils/verifyToken.js'
import singleUpload from '../middleware/mutler.js'

const router = express.Router()

//Create new tour 
router.post('/',singleUpload, createTour)

//Update tour 
router.put('/:id',  updateTour)

//Delete tour 
router.delete('/:id', deleteTour)

//Get single tour 
router.get('/:id', getSingleTour)

//Get all tour 
router.get('/', getAllTour)

//Get tour by search
router.get("/search/getTourBySearch", getTourBySearch)
router.get("/search/getFeaturedTour", getFeaturedTour)
router.get("/search/getTourCount", getTourCount)

router.get("/city/:city", getToursByCity);

export default router