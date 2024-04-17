const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });


async function execute() {
  try {
  await mongoose.connect(process.env.DATABASE);
  console.log("Connected to Mongodb");
  const image_datas = mongoose.connection.db.collection("image_datas");
  // const imagedata = await image_datas.find({ status: "in_progress" }).toArray();
  // const imagedata = await image_datas.find({ status: "not_annotated" }).toArray();
  const imagedata = await image_datas.find({ status: "annotated" }).toArray();


  // Write the documents to a JSON file
  fs.writeFile("output.json", JSON.stringify(imagedata), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
    } else {
      console.log("JSON file written successfully");
    }
  });

  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
}
execute();
