import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export default {
	firebase: {
		apiKey: process.env.apiKey,
		authDomain: process.env.authDomain,
		projectId: process.env.projectId,
		storageBucket: process.env.storageBucket,
		messagingSenderId: process.env.messagingSenderId,
		appId: process.env.appId,
		measurementId: process.env.measurementId,
	},
};

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// export { storage };
