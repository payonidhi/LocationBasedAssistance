import { insertHighway } from "./db";

const highways = [
    {
        highwayNumber: 27,
        highwayName: 'Highway 1',
        craneNumber: 1234567890,
        ambulanceNumber: 9876543210,
        routePatrolNumber: 1122334455,
        regionalOffice: 'Regional Office A',
        nearestPoliceStation: 'Police Station A'
      },
      {
        highwayNumber: 23,
        highwayName: 'Highway 2',
        craneNumber: 1234567890,
        ambulanceNumber: 9876543210,
        routePatrolNumber: 1122334455,
        regionalOffice: 'Regional Office A',
        nearestPoliceStation: 'Police Station A'
      },
      {
        highwayNumber: 47,
        highwayName: 'Highway 3',
        craneNumber: 1234567890,
        ambulanceNumber: 9876543210,
        routePatrolNumber: 1122334455,
        regionalOffice: 'Regional Office A',
        nearestPoliceStation: 'Police Station A'
      },
];

export const insertHighwaysData = () => {
    highways.forEach(highway => {
      insertHighway(
        highway.highwayNumber,
        highway.highwayName,
        highway.craneNumber,
        highway.ambulanceNumber,
        highway.routePatrolNumber,
        highway.regionalOffice,
        highway.nearestPoliceStation
      );
      console.log("Inserted highway data:", highway);
    });
  };