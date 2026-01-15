import express from "express";
import { TMDB_KEY } from "../server.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!TMDB_KEY) {
      console.error("No TMDB API key configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const search = req.query.search as string | undefined;

    // If search query is provided, use the search endpoint
    if (search && search.trim() !== "") {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          search
        )}&language=en-US&page=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TMDB_KEY}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`TMDB API error: ${response.statusText}`);
        return res.status(response.status).json({
          error: "Failed to search movies from TMDB",
        });
      }

      const searchResults = await response.json();
      return res.status(200).json(searchResults);
    }

    // Otherwise, fetch popular movies
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TMDB_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`TMDB API error: ${response.statusText}`);
      return res.status(response.status).json({
        error: "Failed to fetch popular movies from TMDB",
      });
    }

    const popular = await response.json();
    res.status(200).json(popular);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!TMDB_KEY) {
      console.error("No TMDB API key configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const { id } = req.params;

    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TMDB_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`TMDB API error: ${response.statusText}`);
      return res.status(response.status).json({
        error: "Failed to get movie by ID",
      });
    }

    const searchResults = await response.json();
    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error getting movie by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
