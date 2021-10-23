// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDs6ra9d2jl8wATMMLc-aLx-A3tBU8piUk",
    authDomain: "amusers-a8e3d.firebaseapp.com",
    projectId: "amusers-a8e3d",
    storageBucket: "amusers-a8e3d.appspot.com",
    messagingSenderId: "784885616801",
    appId: "1:784885616801:web:893c7490234d041d3620e0",
    measurementId: "G-7XX9VE2XJ0"
  },
  firebaseRolesCollection: 'user-roles',
  firebaseUsersCollection: 'users-x',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
