// import passport from "passport";
// import { config } from "dotenv";
// import { User } from "../db/models";

// const GoogleTokenStrategy = require("passport-google-token").Strategy;

// config();

// const getProfile = (profile) => {
//   const { id, displayName, emails, provider } = profile;
//   if (emails?.length) {
//     const email = emails[0].value;
//     return {
//       googleId: id,
//       name: displayName,
//       email,
//       provider,
//     };
//   }
//   return null;
// };

// passport.use(
//   new GoogleTokenStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google"
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingGoogleAccount = await User.findOne({
//           where: { googleId: profile.id },
//         });

//         if (!existingGoogleAccount) {
//           const existingEmailAccount = await User.findOne({
//             where: { email: getProfile(profile).email },
//           });

//           if (!existingEmailAccount) {
//             const newAccount = await User.create(getProfile(profile));
//             return done(null, newAccount);
//           }
//           return done(null, existingEmailAccount);
//         }
//         return done(null, existingGoogleAccount);
//       } catch (error) {
//         throw new Error(error);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findByPk(id)
//     .then((user) => {
//       done(null, user);
//     })
//     .catch((error) => done(error));
// });

// Import required dependencies
const express = require('express');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Create an instance of the Prisma Client
const prisma = new PrismaClient();

// Configure Google OAuth credentials
const googleClientId = '227263800740-pc9o95c8baqs2lajim37aridsm0qosaa.apps.googleusercontent.com';
const googleClientSecret = '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';
const googleRedirectUri = 'http://localhost:3000/auth/google/callback';

// Configure Passport.js to use Google OAuth2 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleRedirectUri,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        // If the user doesn't exist, create a new user
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              // You can map other user properties from the profile as needed
            },
          });
        }

        // Return the user object
        return done(null, user);
      } catch (error) {
        console.error('Authentication failed', error);
        return done(error);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
