import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { cookieExtractor } from "../utils.js";
import { userService } from "../services/user.services.js";


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
          const newUser = await userService.register({  email, password, ...req.body });
          return done(null, newUser);
        } catch (error) {
          return done(error.message, false);
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
          const user = await userService.login(email, password);
          return done(null, user);
        } catch (error) {
          return done(error.message, false);
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
