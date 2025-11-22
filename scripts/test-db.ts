import { connectToDatabase } from "../database/mongoose";

async function main() {
  try {
    await connectToDatabase();
    console.log("OK: Database connection succeeded");
    process.exit(0);
  } catch (err) {
    console.error("ERROR: Database connection failed");
    console.error(err);
    process.exit(1);
  }
}

main();