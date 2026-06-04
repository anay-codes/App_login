const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  (req, res) => {

    const profileImage =
      req.files.profile?.[0]?.filename || null;

    const resumeFile =
      req.files.resume?.[0]?.filename || null;

    const documentFile =
      req.files.document?.[0]?.filename || null;

    res.json({
      profile_image: profileImage,
      resume_file: resumeFile,
      document_file: documentFile
    });
  }
);

module.exports = router;