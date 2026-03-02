import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { userModel } from "../models/userModel.js";
import { hashPassword, verifyPassword, cookieExtractor } from "../utils.js";

function initializePassport() {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
        session: true,
      },
      async (req, email, password, done) => {
        try {
          const user = req.body;
          const userExists = await userModel.findOne({ email });
          if (userExists) {
            console.log("ya existe una cuenta para ese mail");
            return done(null, false);
          }
          const hashedPassword = hashPassword(password);
          const newUser = await userModel.create({
            ...user,
            password: hashedPassword,
          });
          return done(null, newUser);
        } catch (error) {
          return done(error.message);
        }
      },
    ),
  );
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true,
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email }).lean();
          if (!user) {
            return done(null, false);
          }
          if (verifyPassword(password, user.password)) {
            return done(null, user);
          } else {
            return done(new Error("las credenciales no coinciden"), false);
          }
        } catch (error) {
          return done(error.message);
        }
      },
    ),
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          return done(null, payload);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          return done(null, payload);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}

export default initializePassport;
