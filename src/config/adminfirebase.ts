// // import * as functions from 'firebase-functions'
// import * as admin from "firebase-admin";

import { initializeApp } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

// admin.initializeApp();

// export async function grandAdminRole(email: string) {
//   const user = await admin.auth().getUserByEmail(email);
//   console.log("user in adminrole", user);
//   // if (user.customClaims && user.customClaims.admin === true) {
//   //   return;
//   // }
//   admin.auth().setCustomUserClaims(user.uid, { admin: true });
// }

// const { initializeApp } = require("firebase-admin/app");
// const { getAuth } = require("firebase-admin/auth");
const { getDatabase } = require("firebase-admin/database");
// initializeApp();

// export async function grandAdminRole(uid: string) {
//   getAuth()
//     .setCustomUserClaims(uid, { admin: true })
//     .then(() => {
//       // The new custom claims will propagate to the user's ID token the
//       // next time a new one is issued.
//     });
// }
