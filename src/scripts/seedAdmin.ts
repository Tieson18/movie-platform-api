import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

async function seedAdmin() {
  const email = "admin@example.com";
  const password = "Admin123!"; // change later

  // Check if admin already exists
  const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (existing.rows.length > 0) {
    console.log("Admin already exists");
    process.exit(0);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert admin
  await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
  `,
    ["Admin", email, hashedPassword, "admin"],
  );

  console.log("✅ Admin created:");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
