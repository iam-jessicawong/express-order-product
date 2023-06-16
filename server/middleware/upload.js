import multer from "multer";

const multerFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;

  if (file.mimetype.match(fileTypes)) {
    return cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only image with jpeg/jpg/png format allowed"));
  }
}

const storage = multer.diskStorage({
  destination: "./upload",
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  }
})

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
}).single("image");

export default {
  upload
};
