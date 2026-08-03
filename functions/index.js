const { onSchedule } = require('firebase-functions/v2/scheduler');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Scheduled Cloud Function triggered once every 24 hours.
 * Creates a complete snapshot of tours, hotels, and flights for redundancy & recovery.
 */
exports.dailyDatabaseSnapshot = onSchedule('every 24 hours', async (event) => {
  logger.info('Starting 24-hour automated database snapshot for tours, hotels, and flights...');

  try {
    const timestamp = new Date().toISOString();
    const snapshotId = `snapshot_${Date.now()}`;

    // 1. Fetch current Tours
    const toursSnap = await db.collection('tours').get();
    const toursData = toursSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 2. Fetch current Hotels
    const hotelsSnap = await db.collection('hotels').get();
    const hotelsData = hotelsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. Fetch current Flights
    const flightsSnap = await db.collection('flights').get();
    const flightsData = flightsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 4. Fetch current Packages
    const packagesSnap = await db.collection('packages').get();
    const packagesData = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const snapshotRecord = {
      snapshotId,
      createdAt: timestamp,
      trigger: 'firebase_cloud_function_24h',
      counts: {
        tours: toursData.length,
        hotels: hotelsData.length,
        flights: flightsData.length,
        packages: packagesData.length
      },
      data: {
        tours: toursData,
        hotels: hotelsData,
        flights: flightsData,
        packages: packagesData
      }
    };

    // Store snapshot in the 'snapshots' Firestore collection
    await db.collection('snapshots').doc(snapshotId).set(snapshotRecord);

    logger.info(`Successfully generated 24-hour snapshot [${snapshotId}]: ${toursData.length} tours, ${hotelsData.length} hotels, ${flightsData.length} flights, ${packagesData.length} packages.`);
    return { success: true, snapshotId, timestamp };
  } catch (error) {
    logger.error('Error executing 24-hour scheduled database snapshot:', error);
    throw error;
  }
});
