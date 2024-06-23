require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const {logger} = require("./utils/logger")
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect(process.env.DATABASE)
  .then(() => {
    logger.success("Database connected!");
  })
  .catch((error) => {
    logger.error("Something went wrong when retrieving image data.");
    logger.realError(error);
  });

app.get("/image_data", async (request, response) => {
  logger.info("Image data requested.")
  try {
    const image_datas = mongoose.connection.db.collection("image_datas");
    const imagedata = await image_datas.findOne({ status: "not_annotated" });
    response.send(imagedata);
    logger.success("Image request successfully handled.")
  } catch (error) {
      logger.error("Something went wrong when retrieving image data.");
      logger.realError(error);
  }
});

app.get("/image/:filename", async (request, response) => {
  const filename = request.params.filename;
  logger.info(`Image, ${filename} was requested`);
  try {
      const images = mongoose.connection.db.collection("images");
      const image = await images.findOne({ filename });

      if (image) {
        const imageDataBase64 = image.data.toString("base64");
        const imageData = Buffer.from(imageDataBase64, "base64");
        response.setHeader("Content-Type", "image/png");
        response.send(imageData);
        logger.success(`Image, ${filename} was successfully sent`);
      } else {
        response.status(404).send("Image not found");
        logger.success(`Image, ${filename} was not found`);
      }
  } catch (error) {
          logger.error(`Something went wrong when retrieving image ${filename}.`);
          logger.realError(error);
  }

});


app.post("/", async (request, response) => {

});

app.post("/alter", async (request, response) => {
  const filename = request.body.data[0];
  logger.info(`Image, alter ${filename} was requested`);
  try {
    const image_datas = mongoose.connection.db.collection("image_datas");
    const result = await image_datas.findOneAndUpdate({ filename: filename }, { $set: { status: "in_progress" } });
    response.status(200).send("Request received successfully");
    logger.success(`Changed image ${filename} status to in progress`);
  } catch (error) {
    logger.error(`Something went wrong when altering image ${filename}.`);
    logger.realError(error);
    response.status(500).send("Internal server error");
  }
});

app.post("/upload", async (request, response) => {
  const filename = request.body.filename;
  logger.info(`Uploading image ${filename} datas was requested.`)
  try {
    const annotations = request.body.annotations;
    const environment = request.body.image_annotation;

    const image_datas = mongoose.connection.db.collection("image_datas");

    await image_datas.findOneAndUpdate(
      { filename: filename },
      { $set: { 
        line_annotations: annotations,
        status: "annotated",
        environment_annotation: environment
      } }
    );
    response.status(200).send("Request received successfully");

    logger.success(`Successfully uploaded image ${filename}'s data.`)
  } catch (error) {
    logger.error(`Something went wrong when uploading image data for image ${filename}.`);
    logger.realError(error);
    response.status(500).send("Internal server error");
  }
});

app.listen(8000, function () {
  logger.success("Server started on port 8000.");
});
