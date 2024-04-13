import { readFile } from 'fs/promises';

try {
  const data = await readFile('train.json', 'utf8');
  const jsonData = JSON.parse(data);
  const junctions = jsonData[0]["junctions"];
  const height = jsonData[0]["height"];
  const width = jsonData[0]["width"];
  const file_name = jsonData[0]["filename"];
  const edge_positive = jsonData[0]["edges_positive"];

  // console.log(junctions.length);
  // console.log(height);
  // console.log(width);
  // console.log(file_name);

  // console.log(edge_positive[0]);
  // console.log(junctions)
  console.log(junctions[edge_positive[0][0]])
  console.log(junctions[edge_positive[0][1]])
  const start = [164.16184997558594, 26.80635643005371];
  const end = [169.25286865234375, 119.97126770019531];
} catch (err) {
  console.error('Error:', err);
}