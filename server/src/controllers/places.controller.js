import PlacesService from "../services/places.service.js";
import GooglePlacesFetcher from "../utils/placesDataFetcher.js";

class PlacesController {

    async addPlace(req, res) {
        try {
            const {
                google_place_id,
                type,
                region,
                description,
                image_path
            } = req.body;

            if (!google_place_id) {
                return res.status(400).json({
                    message: "google_place_id is required"
                });
            }

            if (!type) {
                return res.status(400).json({
                    message: "type is required"
                });
            }

            const existing = await PlacesService.getOne(google_place_id);
            if (existing) {
                return res.status(409).json({
                    message: "Place already exists"
                });
            }

            const googleData = await GooglePlacesFetcher.fetchFullPlace(google_place_id);

            const placeToCreate = {
                name: googleData.name,
                lat: googleData.lat,
                lng: googleData.lng,
                rating: googleData.rating,
                reviews_count: googleData.reviews_count,

                type,
                region: region || null,
                description: description || "",
                image_path: image_path || null,

                google_place_id
            };

            const id = await PlacesService.create(placeToCreate);

            res.status(201).json({ id });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Error adding place"
            });
        }
    }


    async getAllPlaces(req, res) {
        try {
            const places = await PlacesService.getAll();
            res.status(200).json(places);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching places" });
        }
    }

    async getOnePlace(req, res) {
        try {
            const { google_place_id } = req.params;
            const place = await PlacesService.getOne(google_place_id);

            if (!place) {
                return res.status(404).json({ message: "Place not found" });
            }

            res.status(200).json(place);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching place" });
        }
    }

    async editPlace(req, res) {
        try {
            const { google_place_id } = req.params;
            const updates = { ...req.body };

            delete updates.google_place_id;

            const existing = await PlacesService.getOne(google_place_id);
            if (!existing) {
                return res.status(404).json({ message: "Place not found" });
            }

            const updated = {
                ...existing,
                ...updates,
            };

            await PlacesService.update(updated);
            res.status(200).json(updated);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error updating place" });
        }
    }

    async deletePlace(req, res) {
        try {
            const { google_place_id } = req.params;

            await PlacesService.deleteOne(google_place_id);
            res.status(200).json({ message: "Place deleted successfully" });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error deleting place" });
        }
    }

    async deleteAllPlaces(req, res) {
        try {
            await PlacesService.deleteAll();
            res.status(200).json({ message: "All places deleted successfully" });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error deleting places" });
        }
    }

    async updateAllPlaces(req, res) {
        try {
            const places = await PlacesService.getAll();

            for (const place of places) {
                try {
                    const stats = await GooglePlacesFetcher.fetchGoogleStats(place.google_place_id);

                    await PlacesService.updateGoogleStats(
                        place.google_place_id,
                        stats.rating,
                        stats.reviews_count
                    );

                } catch (e) {
                    console.error(
                        `Failed to update ${place.google_place_id}:`,
                        e.message
                    );
                }
            }

            res.status(200).json({
                message: "All places updated successfully"
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Error updating places"
            });
        }
    }


    async getAlternatives(req, res) {
        try {
            const { google_place_id } = req.params;
            const limit = Number(req.query.limit) || 5;

            const alternatives =
                await PlacesService.findAlternatives(google_place_id, limit);

            res.status(200).json({ alternatives });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Failed to fetch alternative places"
            });
        }
    }
}

export default new PlacesController();




