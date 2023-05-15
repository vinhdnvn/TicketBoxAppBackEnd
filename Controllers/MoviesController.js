import Movie from "../Models/MovieModels.js";
import asyncHandler from "express-async-handler";
import Cinema from "../Models/cinemaModels.js";
import User from "../Models/UserModels.js";

// **************** ADMIN CONTROLLERS ****************
// @desc add new movies
// @route POST /api/movies
// @access Public
const addMovies = asyncHandler(async (req, res) => {
	try {
		const {
			nameMovie,
			gerne,
			time,
			video,
			language,
			rating,
			year,
			rottenTomatoes,
			ign,
			image,
			description,
			stars,
		} = req.body;
		// create new movie
		const movie = new Movie({
			nameMovie,
			gerne,
			time,
			video,
			language,
			rating,
			year,
			rottenTomatoes,
			ign,
			image,
			description,
			stars,
		});
		// save movie
		const createdMovie = await movie.save();
		res.status(201).json({ message: "Movie created successfully", createdMovie });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc add new movies to cinema
// @route POST /api/movies/:id
// @access Public
const addMoviesToCinema = asyncHandler(async (req, res) => {
	try {
		const {
			nameMovie,
			gerne,
			time,
			video,
			language,
			rating,
			year,
			rottenTomatoes,
			ign,
			image,
			description,
			stars,
		} = req.body;
		const cinema = await Cinema.findById(req.params._id);
		if (cinema) {
			// create new movie
			const movie = new Movie({
				nameMovie,
				gerne,
				time,
				video,
				language,
				rating,
				year,
				rottenTomatoes,
				ign,
				image,
				description,
				stars,
			});
			cinema.movies.push(movie);
			const updatedCinema = await cinema.save();
			//   res.json({ message: "Movies added to cinema successfully", updatedCinema });
			// response with cinema name and movies data
			res.json({ cinemaName: cinema.name, movies: updatedCinema.movies });
		} else {
			res.status(404).json({ message: "Cinema not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc get all movies
// @route GET /api/movies
// @access Public
const getMovies = asyncHandler(async (req, res) => {
	try {
		// filter movies by gerne, time, language,rating ,year and search
		const { gerne, time, language, rating, year, search } = req.query;
		let query = {
			...(gerne && { gerne }),
			// ...(time && { time }),
			// search time in range upper
			...(time && { time: { $gte: time } }),
			...(language && { language }),
			...(rating && { rating }),
			...(year && { year }),
			...(search && { nameMovie: { $regex: search, $options: "i" } }),
		};
		// loasd more movies functionality
		const page = Number(req.query.pageNumber) || 1;
		const limit = 10;
		const skip = (page - 1) * limit;

		// find movies by query, skip and limit
		const movies = await Movie.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
		// get total number of movies
		const count = await Movie.countDocuments(query);

		// send response with movies and total number of movies
		res.json({ movies, page, pages: Math.ceil(count / limit), totalMovies: count });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc get movie by id
// @route GET /api/movies/:_id
// @access Public
const getMovieById = asyncHandler(async (req, res) => {
	try {
		// find movie by id in database
		const movie = await Movie.findById(req.params._id);
		// if movie if found send it to the client
		if (movie) {
			res.json(movie);
		}
		// if movie is not found send error message
		else {
			res.status(404).json({ message: "Movie not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
		throw new Error("Movie not found");
	}
});

// @desc get top rated movies
// @route GET /api/movies/rated/top
// @access Public
const getTopRatedMovies = asyncHandler(async (req, res) => {
	try {
		// find top rating movies
		const movies = await Movie.find({}).sort({ rating: -1 });
		// send top rated movies to the client
		res.json(movies);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc Get random movies
// @route GET /api/movies/random/all
// @access Public
const getRandomMovies = asyncHandler(async (req, res) => {
	try {
		// find random movies
		const movies = await Movie.aggregate([{ $sample: { size: 5 } }]);
		// send random movies to the client
		res.json(movies);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc create movie review
// @route POST /api/movies/:_id/reviews
// @access Private
const createMovieReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;
	try {
		// find movie by id in database
		const movie = await Movie.findById(req.params._id);

		if (movie) {
			// check if the user already reviewd this movie
			const alreadyReviewed = movie.reviews.find(
				(review) => review.userId.toString() === req.user._id.toString()
			);
			// if the user already reviewd this movie send error message
			if (alreadyReviewed) {
				res.status(400).json({ message: "Movie already reviewed" });
			}
			// else create a new review
			const review = {
				name: req.user.name,
				userImage: req.user.userImage,
				rating: Number(rating),
				comment,
				userId: req.user._id,
			};
			// push the new review to the reviews array
			movie.reviews.push(review);
			// increment the number of reviews
			movie.numberOfReviews = movie.reviews.length;
			// calculate the new rating
			movie.rating =
				movie.reviews.reduce((acc, item) => item.rating + acc, 0) / movie.reviews.length;

			// save the movie in database
			await movie.save();
			// send the new movie to the client
			res.status(201).json({ message: "Review added" });
		} else {
			res.status(404);
			throw new Error("Movie not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// ================= ADMIN CONTROLLERS =================
// @desc update movie
// @route PUT /api/movies/:_id
// @access Private/Admin

const updateMovie = asyncHandler(async (req, res) => {
	try {
		// get data from request body
		const {
			nameMovie,
			gerne,
			time,
			video,
			language,
			rating,
			year,
			rottenTomatoes,
			ign,
			image,
			description,
		} = req.body;
		// find movie by id in database
		const movie = await Movie.findById(req.params._id);

		if (movie) {
			// update movie data
			movie.nameMovie = nameMovie || movie.nameMovie;
			movie.gerne = gerne || movie.gerne;
			movie.time = time || movie.time;
			movie.video = video || movie.video;
			movie.language = language || movie.language;
			movie.rating = rating || movie.rating;
			movie.year = year || movie.year;
			movie.rottenTomatoes = rottenTomatoes || movie.rottenTomatoes;
			movie.ign = ign || movie.ign;
			movie.image = image || movie.image;
			movie.description = description || movie.description;
			// save the updated movie in database
			const updatedMovie = await movie.save();
			// send the updated movie to the client
			res.json(updatedMovie);
		} else {
			res.status(404);
			throw new Error("Movie not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @desc delete movie
// @route DELETE /api/movies/:_id
// @access Private/Admin
const deleteMovie = asyncHandler(async (req, res) => {
	try {
		// find movie by id in database
		const movie = await Movie.findById(req.params._id);
		if (movie) {
			// delete movie from database
			await movie.deleteOne();
			// send success message to the client
			res.json({ message: "Movie removed" });
		} else {
			res.status(404);
			throw new Error("Movie not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// @descs get the isPopular Movies
// @route GET /api/movies/popular
// @access Public
const getPopularMovies = asyncHandler(async (req, res) => {
	try {
		// find the isPopular movies
		const movies = await Movie.find({ isPopular: true });
		// send the isPopular movies to the client
		res.json(movies);
	} catch (error) {
		res.status(400).json({ message: error.message });
		console.log("cant find");
	}
});

// @desc like movie by User id and movie id
// @route PUT /api/movies/:_id/like
// @access Private
const likeMovie = asyncHandler(async (req, res) => {
	const { userId, movieId } = req.body;
	try {
		// find movie by id in database
		const movie = await Movie.findById(movieId);
		if (movie) {
			// update the movieId in the likeMovies array in User model
			await User.findByIdAndUpdate(userId, {
				$push: { likeMovies: movieId },
			});
			res.json({ message: "Movie liked" });
		} else {
			res.status(404);
			throw new Error("Movie not found");
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
		console.log("cant find");
	}
});

export {
	addMovies,
	getMovies,
	getMovieById,
	getTopRatedMovies,
	getRandomMovies,
	createMovieReview,
	updateMovie,
	deleteMovie,
	addMoviesToCinema,
	getPopularMovies,
};
