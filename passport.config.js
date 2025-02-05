const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('./model/database');

function initialize (passport) {

    passport.use(new LocalStrategy(
        //email is used as username for passport-local
        
        async function (username, password, done) {
           
            pool.query('SELECT * FROM users WHERE email=$1', [username], (err, user) => {
                if(err) {return done(err);}
                if(user.rows.length === 0) { 
                    
                    return done(null, false); 
                }
    
                bcrypt.compare(password, user.rows[0].password, (err, verified) => {
                    if(err) { return done(err); }
                    
                    if(verified){ 
                        
                        return done(null, user.rows[0]); }
    
                    return done(null, false);
                });
    
            })
        }
    ))
    
    //seriealize user
    passport.serializeUser((user, done) => {
        return done(null, user.id);
    })
    
    //deserialize user
    passport.deserializeUser((id, done) => {
        pool.query('SELECT id, email, role FROM users WHERE id = $1', [id], (err, results) => {
            if(err) return done(err);
            return done(null, results.rows[0]);
        })
    })
}

module.exports = initialize;