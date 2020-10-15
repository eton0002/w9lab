var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {
    getAll: function (req, res) {
        Movie.find({})
        .populate('actors')
        .exec(function
            (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    deleteOne: function(req,res){
        Movie.findByIdAndDelete({ _id: req.params.id }, function (err, movie){
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        })
    }, 
    addActor: function (req, res) {

        console.log(req.params.mId); 
        console.log(req.params.aId); 

        Movie.findOne({ _id: (req.params.mId)}, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: (req.params.aId)}, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                actor.movies.push(movie._id);

                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                });

                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },
    getMoviesLimit: function(req,res){
        if (req.params.yr1 < req.params.yr2){
            Movie.find({
                $and: [
                    {year: {$gte: req.params.yr1}}, 
                    {year: {$lte: req.params.yr2}}
                ]     
            }).populate('actors')
            .exec(function
                (err, movies) {
                if (err) return res.status(400).json(err);
                res.json(movies);
            });
        }
        else {
            return res.status(404).json("Yr 1 must be before yr 2");
        }

    }, 
    deleteMoviesLimit: function(req,res){

        dateLimit = parseInt(req.params.aYear);

        console.log(dateLimit);

            Movie.deleteMany({year: {$lte: dateLimit}}, (function(err, movies) {
                if (err) return res.status(400).json(err);
                console.log(movies); 
                res.json(movies);
            }));   
    }, 
    removeActor: function(req,res){
        Movie.findByIdAndUpdate({ _id: req.params.mId }, 
            {$pull:{"actors": mongoose.Types.ObjectId(req.params.aId)}},
            function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findByIdAndUpdate({ _id: req.params.aId }, 
                {$pull:{"movies": mongoose.Types.ObjectId(req.params.mId)}},
                function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
            })

            res.json(movie);
        })
    } 
};