// import express from "express";
// import { testPostController } from "../controller/testController.js";

// // router object

// const router = express.Router()

// // routes
// router.post('/test', testPostController)



// export default router

import express from "express";
import { testPostController } from "../controller/testController.js";
import userAuth from "../middlewares/authMiddleware.js";
// import userAuth from "../middelwares/authMiddleware.js";

//router object
const router = express.Router();

//routes
router.post("/test-post", userAuth, testPostController);

//export
export default router;