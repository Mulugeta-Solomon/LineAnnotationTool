const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const {logger} = require("./logger")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });


async function execute() {
  try {
  await mongoose.connect(process.env.DATABASE);
  logger.success("Connected to Mongodb");
  const image_datas = mongoose.connection.db.collection("image_datas");
  // const imagedata = await image_datas.find({ status: "in_progress" }).toArray();
  // const imagedata = await image_datas.find({ status: "not_annotated" }).toArray();
  const imagedata = await image_datas.find({ status: "annotated" }).toArray();


  // Write the documents to a JSON file
  fs.writeFile("output.json", JSON.stringify(imagedata), (err) => {
    if (err) {
      logger.error("Error writing to JSON file:");
      logger.realError(err)
    } else {
      logger.success("JSON file written successfully");
    }
  });

  } catch (err) {
    logger.error("Error when saving data.");
    logger.realError(err);
  } finally {
    logger.success("Disconnected Database");
    mongoose.disconnect();
  }
}
execute();
