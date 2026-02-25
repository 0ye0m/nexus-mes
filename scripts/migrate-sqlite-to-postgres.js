/**
 * migrate-sqlite-to-postgres.js
 *
 * Usage:
 * 1. Install deps: `npm install better-sqlite3 @prisma/client`
 * 2. Set `DATABASE_URL` in your local `.env` to your Supabase Postgres URL
 * 3. Run `npx prisma generate` then `node scripts/migrate-sqlite-to-postgres.js`
 *
 * This script reads rows from the local SQLite DB at `./db/custom.db`
 * and inserts them into the Postgres DB via Prisma. It uses `createMany`
 * with `skipDuplicates` to avoid duplicate inserts.
 */

const path = require('path')
const Database = require('better-sqlite3')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const sqlitePath = path.join(__dirname, '..', 'db', 'custom.db')
  const db = new Database(sqlitePath, { readonly: true })

  const mapRows = (rows) => rows.map(r => {
    // Convert numeric timestamps to JS Date, and leave strings as-is
    Object.keys(r).forEach(k => {
      if (r[k] && typeof r[k] === 'string') {
        // attempt ISO date parsing for columns ending with Date/At
        if (/Date$|At$/i.test(k)) {
          const d = new Date(r[k])
          if (!isNaN(d)) r[k] = d
        }
      }
    })
    return r
  })

  try {
    console.log('Reading SQLite tables...')

    // Users
    try {
      const users = db.prepare('SELECT * FROM "User"').all()
      if (users.length) {
        console.log(`Importing ${users.length} users`)
        await prisma.user.createMany({ data: mapRows(users), skipDuplicates: true })
      }
    } catch (e) { console.warn('No User table or read error:', e.message) }

    // Materials
    try {
      const materials = db.prepare('SELECT * FROM "Material"').all()
      if (materials.length) {
        console.log(`Importing ${materials.length} materials`)
        await prisma.material.createMany({ data: mapRows(materials), skipDuplicates: true })
      }
    } catch (e) { console.warn('No Material table or read error:', e.message) }

    // ProductionSchedule
    try {
      const schedules = db.prepare('SELECT * FROM "ProductionSchedule"').all()
      if (schedules.length) {
        console.log(`Importing ${schedules.length} schedules`)
        await prisma.productionSchedule.createMany({ data: mapRows(schedules), skipDuplicates: true })
      }
    } catch (e) { console.warn('No ProductionSchedule table or read error:', e.message) }

    // Assembly
    try {
      const assemblies = db.prepare('SELECT * FROM "Assembly"').all()
      if (assemblies.length) {
        console.log(`Importing ${assemblies.length} assemblies`)
        await prisma.assembly.createMany({ data: mapRows(assemblies), skipDuplicates: true })
      }
    } catch (e) { console.warn('No Assembly table or read error:', e.message) }

    // Inspection
    try {
      const inspections = db.prepare('SELECT * FROM "Inspection"').all()
      if (inspections.length) {
        console.log(`Importing ${inspections.length} inspections`)
        await prisma.inspection.createMany({ data: mapRows(inspections), skipDuplicates: true })
      }
    } catch (e) { console.warn('No Inspection table or read error:', e.message) }

    // ProductionCost
    try {
      const costs = db.prepare('SELECT * FROM "ProductionCost"').all()
      if (costs.length) {
        console.log(`Importing ${costs.length} production costs`)
        await prisma.productionCost.createMany({ data: mapRows(costs), skipDuplicates: true })
      }
    } catch (e) { console.warn('No ProductionCost table or read error:', e.message) }

    // PerformanceMetric
    try {
      const metrics = db.prepare('SELECT * FROM "PerformanceMetric"').all()
      if (metrics.length) {
        console.log(`Importing ${metrics.length} performance metrics`)
        await prisma.performanceMetric.createMany({ data: mapRows(metrics), skipDuplicates: true })
      }
    } catch (e) { console.warn('No PerformanceMetric table or read error:', e.message) }

    // Activity
    try {
      const activities = db.prepare('SELECT * FROM "Activity"').all()
      if (activities.length) {
        console.log(`Importing ${activities.length} activities`)
        await prisma.activity.createMany({ data: mapRows(activities), skipDuplicates: true })
      }
    } catch (e) { console.warn('No Activity table or read error:', e.message) }

    console.log('Data import finished.')
  } catch (err) {
    console.error('Migration error:', err)
  } finally {
    await prisma.$disconnect()
    db.close()
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
