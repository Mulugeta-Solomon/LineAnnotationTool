const mongoose = require("mongoose");
const path = require("path");
const { logger } = require("./logger");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function execute() {
  try {
    await mongoose.connect(process.env.DATABASE);
    logger.success("Connected to Mongodb");
    const image_datas = mongoose.connection.db.collection("image_datas");
    const image = mongoose.connection.db.collection("images");
    // // // check if the 00031616.png image exists
    // const imageExists = await image.findOne({ filename: "00031816.png" });
    // if (imageExists) {
    //   logger.success("Image 00031616.png exists.");
    // } else {
    //   logger.error("Image 00031616.png does not exist.");
    // }
    // // show image data for 00031816.png
    // const imageData = await image_datas.findOne({ filename: "00031816.png" });
    // if (imageData) {
    //   logger.success("Image data for 00031816.png exists.");
    //   logger.info(imageData);
    // } else {
    //   logger.error("Image data for 00031816.png does not exist.");
    // }
    
    // Count the number of images with the status 'annotated'
    const annotatedCount = await image_datas.countDocuments({ status: "annotated" });
    logger.success(`There are ${annotatedCount} images with status 'annotated'.`);
    
    const result = await image_datas.updateMany({ status: "in_progress" }, { $set: { status: "not_annotated" } });
    
    logger.success(`Successfully reverted ${result.modifiedCount} image status.`)
  } catch (err) {
    logger.error("Error when saving data.");
    logger.realError(err);
  } finally {
    logger.success("Disconnected Database");
    mongoose.disconnect();
  }
}
execute();
