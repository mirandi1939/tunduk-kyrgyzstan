import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import adminEndpoints from "./enpoints/admin.endpoints.js";
import guesthousesEndpoints from "./enpoints/guesthouses.endpoints.js";
import operatorsEndpoints from "./enpoints/operators.endpoints.js";
import itinerariesEndpoints from "./enpoints/itineraries.endpoints.js";
import forumEndpoints from "./enpoints/forum.endpoints.js";
import emergencyEndpoints from "./enpoints/emergency.endpoints.js";
import womensEndpoints from "./enpoints/womens.endpoints.js";
import bookingsEndpoints from "./enpoints/bookings.endpoints.js";
import foodEndpoints from "./enpoints/food.endpoints.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use("/api/admin", adminEndpoints);
app.use("/api/guesthouses", guesthousesEndpoints);
app.use("/api/operators", operatorsEndpoints);
app.use("/api/itineraries", itinerariesEndpoints);
app.use("/api/forum", forumEndpoints);
app.use("/api/emergency", emergencyEndpoints);
app.use("/api/womens", womensEndpoints);
app.use("/api/bookings", bookingsEndpoints);
app.use("/api/food", foodEndpoints);

export default app;
