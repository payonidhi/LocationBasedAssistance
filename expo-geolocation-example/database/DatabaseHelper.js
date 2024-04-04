import SQLite from 'react-native-sqlite-storage';

const openDatabase = () => {
  console.log("Opening database...");
  return SQLite.openDatabase({ name: 'highways.db', location: 'default' });
};

const fetchHighwayData = async (highwayNumber) => {
  console.log("Fetching data for highway number:", highwayNumber);
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM highways WHERE highwayNumber = ?',
        [highwayNumber],
        (tx, results) => {
          console.log("Query executed successfully");
          console.log("Number of rows returned:", results.rows.length);
          if (results.rows.length > 0) {
            const data = results.rows.item(0);
            console.log("Data found:", data);
            resolve(data);
          } else {
            console.log("No data found for given highway number:", highwayNumber);
            reject(new Error('No data found for highway number'));
          }
        },
        (error) => {
          console.error("Error executing SQL query:", error);
          reject(error);
        }
      );
    });
  });
};


export { fetchHighwayData };
