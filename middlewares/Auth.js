import jwt from "jsonwebtoken";
import User from "../Models/UserModels.js";
import asyncHandler from "express-async-handler";

// generate a token
// @rdesc Auth user & get token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
};

// protection middleware
const protect = asyncHandler(async (req, res, next) => {
	let token;
	// check if token exists and starts with Bearer
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			// verify token andd get user id
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			// get user id frm decoded token
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error("Not authorized, token failed");
		}
	}

	//  if token not found in headers send error
	if (!token) {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

// admin check middleware
const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401);
		throw new Error("Not authorized as an admin");
	}
};

export { generateToken, protect, admin };
