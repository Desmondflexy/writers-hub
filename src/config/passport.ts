import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { Author } from "../model/author";

export default function passportSetup(){
  try {
    passport.use(new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: '/auth/google/redirect'
      }, async function(accessToken, refreshToken, profile, done){
        const {sub, name, email, picture} = profile._json;
        let author = await Author.findOne({email});
        if (author) return done(null, author);
        author = new Author({
          name,
          email,
        })
        await author.save();
        return done(null, author)
      }
    ));
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id, done) =>{
      Author.findById(id).then((user) => {
        done(null, user);
      });
    })
  } catch (error) {
    console.log('error setting up passport', error)
  }
}

