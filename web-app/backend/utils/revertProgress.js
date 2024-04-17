const mongoose = require("mongoose");
const path = require("path");
const { logger } = require("./logger");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function execute() {
  try {
    await mongoose.connect(process.env.DATABASE);
    logger.success("Connected to Mongodb");
    const image_datas = mongoose.connection.db.collection("image_datas");
    await image_datas.updateMany({ status: "in_progress" }, { $set: { status: "not_annotated" } });
    logger.success("Successfully reverted images status.")
  } catch (err) {
    logger.error("Error when saving data.");
    logger.realError(err);
  } finally {
    logger.success("Disconnected Database");
    mongoose.disconnect();
  }
}
execute();
