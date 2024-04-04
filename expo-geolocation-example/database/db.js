
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('highways.db');

export const setupDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Highways (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        highwayNumber INTEGER,
        highwayName TEXT,
        craneNumber INTEGER,
        ambulanceNumber INTEGER,
        routePatrolNumber INTEGER,
        regionalOffice TEXT,
        nearestPoliceStation TEXT
      );`,
      [],
      () => {
        console.log('Database table created successfully.');
      },
      error => console.error('Error creating database table:', error)
    );
  });
};


export const insertHighway = (
  highwayNumber,
  highwayName,
  craneNumber,
  ambulanceNumber,
  routePatrolNumber,
  regionalOffice,
  nearestPoliceStation
) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO Highways (highwayNumber, highwayName, craneNumber, ambulanceNumber, routePatrolNumber, regionalOffice, nearestPoliceStation) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [highwayNumber, highwayName, craneNumber, ambulanceNumber, routePatrolNumber, regionalOffice, nearestPoliceStation],
      (_, { rowsAffected }) => {
        if (rowsAffected > 0) {
          console.log('Highway inserted successfully');
        } else {
          console.log('Failed to insert highway');
        }
      },
      error => console.error(error)
    );
  });
};
