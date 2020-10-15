//https://hub.packtpub.com/building-movie-api-express/
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const actors = require('./routers/actor');
const movies = require('./routers/movie');

let path = require('path'); 

const app = express();
app.listen(8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/movies', 
    {useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true}
    ,function (err) {
        if (err) {
            return console.log('Mongoose - connection error:', err);
        }
        console.log('Connect Successfully');
    });


app.use("/", express.static(path.join(__dirname, "dist/movieAng"))); 


//Configuring Endpoints
//Actor RESTFul endpoionts 
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);
app.delete('/actors/:id/movies', actors.deleteActMovies); 
app.put('/actors/:aId/:mId', actors.removeMovie); 

//Movie RESTFul  endpoints
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);
app.put('/movies/:mId/actors/:aId', movies.addActor);
app.delete('/movies/:id', movies.deleteOne); 
app.put('/movies/:mId/:aId', movies.removeActor); 
app.get('/movies/:yr1/:yr2', movies.getMoviesLimit); 
app.delete('/movies/by-year/:aYear', movies.deleteMoviesLimit); 