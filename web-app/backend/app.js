require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.get("/image_data", async (request, response) => {
  const image_datas = mongoose.connection.db.collection("image_datas");
  const imagedata = await image_datas.findOne({ status: "not_annotated" });
  response.send(imagedata);
});

app.get("/image/:filename", async (request, response) => {
  const images = mongoose.connection.db.collection("images");
  const filename = request.params.filename;
  const image = await images.findOne({ filename });

  if (image) {
    const imageDataBase64 = image.data.toString("base64"); 
    const imageData = Buffer.from(imageDataBase64, "base64");
    response.setHeader("Content-Type", "image/png");
    response.send(imageData);
  } else {
    response.status(404).send("Image not found");
  }
});


app.post("/", async (request, response) => {

});

app.post("/alter", async (request, response) => {
  try {
    const filename = request.body.data[0];
    const image_datas = mongoose.connection.db.collection("image_datas");
    const result = await image_datas.findOneAndUpdate({ filename: filename }, { $set: { status: "in_progress" } });
    response.status(200).send("Request received successfully");
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal server error");
  }
});
app.post("/upload", async (request, response) => {
  try {
    
    const filename = request.body.filename;
    const annotations = request.body.annotations;
    const image_datas = mongoose.connection.db.collection("image_datas");
    await image_datas.findOneAndUpdate(
      { filename: filename },
      { $set: { line_annotations: annotations } }
    );
    await image_datas.findOneAndUpdate(
      { filename: filename },
      { $set: { status: "annotated" } }
    );
    response.status(200).send("Request received successfully");
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal server error");
  }
});

app.listen(8000, function () {
  console.log("Server started on port 8000.");
});
