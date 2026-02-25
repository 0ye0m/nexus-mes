/**
 * migrate-sqlite-to-postgres.js
 *
 * Migrates data from SQLite (./db/custom.db)
 * to Supabase PostgreSQL via Prisma.
 */

const path = require("path");
const Database = require("better-sqlite3");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Convert SQLite row values to Prisma-compatible values
 */
const mapRows = (rows) =>
  rows.map((row) => {
    const newRow = { ...row };

    Object.keys(newRow).forEach((key) => {
      const value = newRow[key];

      // ✅ Convert numeric timestamps → Date
      if (typeof value === "number" && value > 1000000000000) {
        newRow[key] = new Date(value);
      }

      // ✅ Convert ISO string dates → Date
      if (typeof value === "string" && /Date$|At$/i.test(key)) {
        const parsed = new Date(value);
        if (!isNaN(parsed)) newRow[key] = parsed;
      }

      // ✅ Convert ONLY known boolean field
      if (key === "approved") {
        newRow[key] = Boolean(value);
      }
    });

    return newRow;
  });

async function importTable(tableName, prismaModel) {
  try {
    const sqlitePath = path.join(__dirname, "..", "db", "custom.db");
    const db = new Database(sqlitePath, { readonly: true });

    const rows = db.prepare(`SELECT * FROM "${tableName}"`).all();

    if (!rows.length) {
      console.log(`No data found in ${tableName}`);
      db.close();
      return;
    }

    console.log(`Importing ${rows.length} ${tableName} records...`);

    await prisma[prismaModel].createMany({
      data: mapRows(rows),
      skipDuplicates: true,
    });

    console.log(`✅ ${tableName} imported successfully`);
    db.close();
  } catch (err) {
    console.error(`❌ Error importing ${tableName}:`, err.message);
  }
}

async function main() {
  console.log("🚀 Starting SQLite → Supabase migration...\n");

  await importTable("User", "user");
  await importTable("Material", "material");
  await importTable("ProductionSchedule", "productionSchedule");
  await importTable("Assembly", "assembly");
  await importTable("Inspection", "inspection");
  await importTable("ProductionCost", "productionCost");
  await importTable("PerformanceMetric", "performanceMetric");
  await importTable("Activity", "activity");

  console.log("\n🎉 Migration completed.");
}

main()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });