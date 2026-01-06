import app from "./app.js";
import { db } from "./db/db.js";
import fs from "fs";
import path from "path";

const schemaPath = path.resolve("src/db/schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema, (err) => {
  if (err) {
    console.error("Schema creation failed:", err);
  } else {
    console.log("Database schema ready");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
