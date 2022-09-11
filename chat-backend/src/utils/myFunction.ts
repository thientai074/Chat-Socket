import multer from "multer";

// Upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const upload = multer({storage: storage}).single("singleFile");
