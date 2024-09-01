const express = require("express");
const path = require("path");
const cors = require("cors");
const {
  generateQRCodeFromData,
  showLoader,
  hideLoader,
} = require("./src/QrCode.js");
const QRCode = require("qrcode");


const app = express();
const port = process.env.PORT || 8000;

// Enabled CORS for all origins
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/api/qrgen", async (req, res) => {
  const { data, url, name, phoneNum, org, address } = req.query;

  try {
    let qrData;
    if (data) {
      qrData = `${data}`;
    } else if (url) {
      qrData = `${url}`;
    } else if (name || phoneNum || address || org) {
      qrData = `BEGIN:VCARD
VERSION:3.0
FN:${name || ""}
TEL:${phoneNum || ""}
ADR:${address || ""}
ORG:${org || ""}
END:VCARD`;
    } else {
      return res.status(400).send("Missing required data");
    }

    const qrCodeBuffer = await QRCode.toBuffer(qrData);
    res.type("png").send(qrCodeBuffer);
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).send("Error generating QR code");
  }
});

app.get("/qrgen", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api", (req, res) => {
  res.sendFile(path.join(__dirname, "public/api.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
