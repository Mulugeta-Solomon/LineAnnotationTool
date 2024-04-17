const mongoose = require("mongoose");
const { readFile } = require("fs/promises");
const path = require("path");
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
    console.log("Database connected!");
    const data = await readFile("train.json", "utf8");
    const jsonData = JSON.parse(data);
    const all_images = jsonData.length;
    for (let i = 0; i < all_images; i++) {
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

      const data = await readFile(`../images/${jsonData[i]["filename"]}`);
      const image = new MongoImage({
        filename: jsonData[i]["filename"],
        data: data,
        contentType: "image/png",
      });
      await image.save();

      console.log(`Added image ${i+1}`);
    }
  } catch (err) {
    console.error("Error:", err);
  } 
  finally{
    mongoose.disconnect()
  }
}
execute();
