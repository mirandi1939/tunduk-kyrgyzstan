import Router from "express";
import multer from "multer";
import path from "path";
import PlacesController from "../controllers/places.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const router = new Router();

router.use(adminAuth);

const storage = multer.diskStorage({
    destination: "uploads/places/",
    filename: (req, file, cb) => {
        const name = path.parse(file.originalname).name.replace(/\s+/g, "-");
        const ext = path.extname(file.originalname);
        cb(null, `${name}${ext}`);
    },
});
const upload = multer({ storage });

// READ
router.get("/places/google/update/all", PlacesController.updateAllPlaces);
router.get("/places", PlacesController.getAllPlaces);
router.get("/places/:google_place_id", PlacesController.getOnePlace);

// WRITE
router.post("/places", PlacesController.addPlace);
router.put("/places/:google_place_id", PlacesController.editPlace);
router.delete("/places/:google_place_id", PlacesController.deletePlace);
router.delete("/places", PlacesController.deleteAllPlaces);

// UPLOAD
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ image_path: `/uploads/places/${req.file.filename}` });
});

export default router;
