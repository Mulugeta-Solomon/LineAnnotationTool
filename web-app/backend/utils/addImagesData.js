const mongoose = require("mongoose");
const { readFile } = require("fs/promises");
const path = require("path");
const {logger} = require("./logger");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const imageDataSchema = new mongoose.Schema({
  junctions: Array,
  height: Number,
  width: Number,
  filename: String,
  edges_positive: Array,
  line_annotations: Array,
  environment_annotation:Boolean,
  status: String,
});

const imageSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
});

const ImageData = mongoose.model("image_data", imageDataSchema);
const MongoImage = mongoose.model("image", imageSchema);

async function execute() {
  try {
    await mongoose.connect(process.env.DATABASE);
    logger.success("Database connected!");
    const data = await readFile("../../../data/raw_data/train.json", "utf8");
    const jsonData = JSON.parse(data);
    const all_images = jsonData.length;

    for (let i = 0; i < all_images; i++) {
      const filename = jsonData[i]["filename"];

      // check if image data already exists
      const existingImageData  = await ImageData.findOne({ filename});
      if (existingImageData) {
        logger.info(`Image data for ${filename} already exists. Skipping...`);
      }
      else{

          const imageData = new ImageData({
            junctions: jsonData[i]["junctions"],
            height: jsonData[i]["height"],
            width: jsonData[i]["width"],
            filename: jsonData[i]["filename"],
            edges_positive: jsonData[i]["edges_positive"],
            status: "not_annotated",
            environment_annotation:true,
            line_annotations: Array(jsonData[i]["edges_positive"].length).fill(0),
          });
          await imageData.save();
          logger.success(`Added image data ${i+1} and current filename is ${filename}`);
        }
      // check if image already exists

      const existingImage  = await MongoImage.findOne({ filename });
      if (existingImage) {
        logger.info(`Image ${filename} already exists. Skipping...`);
        continue;
      }

      const data = await readFile(`../../../data/images/${jsonData[i]["filename"]}`);
      const image = new MongoImage({
        filename: jsonData[i]["filename"],
        data: data,
        contentType: "image/png",
      });
      await image.save();

      logger.success(`Added image ${i+1} and currrent filename is ${filename}`);
    }
  } catch (err) {
    logger.error("Something went wrong when uploading images");
    logger.realError(err);
  } 
  finally{
    mongoose.disconnect()
    logger.success("Disconnected Database")
  }
}
execute();