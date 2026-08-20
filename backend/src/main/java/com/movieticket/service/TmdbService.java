package com.movieticket.service;

import com.movieticket.dto.TmdbDTOs.*;
import com.movieticket.entity.Movie;
import com.movieticket.entity.Show;
import com.movieticket.entity.Theater;
import com.movieticket.repository.MovieRepository;
import com.movieticket.repository.ShowRepository;
import com.movieticket.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TmdbService {

    @Value("${tmdb.api-key:DEMO_KEY}")
    private String apiKey;

    @Value("${tmdb.base-url:https://api.themoviedb.org/3}")
    private String baseUrl;

    @Value("${tmdb.image-base-url:https://image.tmdb.org/t/p}")
    private String imageBaseUrl;

    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final ShowRepository showRepository;
    private final RestTemplate restTemplate;

    public TmdbService(MovieRepository movieRepository, TheaterRepository theaterRepository, ShowRepository showRepository) {
        this.movieRepository = movieRepository;
        this.theaterRepository = theaterRepository;
        this.showRepository = showRepository;
        this.restTemplate = new RestTemplate();
    }


    public List<TmdbMovieSummary> searchMovies(String query) {
        if (query == null || query.isBlank()) {
            return getNowPlaying();
        }

        if (isRealApiKeyConfigured()) {
            try {
                String url = String.format("%s/search/movie?api_key=%s&query=%s&include_adult=false&language=en-US&page=1",
                        baseUrl, apiKey, query);
                TmdbSearchResponse response = restTemplate.getForObject(url, TmdbSearchResponse.class);
                if (response != null && response.getResults() != null) {
                    return formatSummaries(response.getResults());
                }
            } catch (Exception e) {
                // Fallback to mock search on error or invalid key
            }
        }

        // Fallback / Mock search filtering demo movies
        String lowerQuery = query.toLowerCase();
        return getMockMovies().stream()
                .filter(m -> m.getTitle().toLowerCase().contains(lowerQuery) || m.getOverview().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());
    }

    public List<TmdbMovieSummary> getNowPlaying() {
        if (isRealApiKeyConfigured()) {
            try {
                String url = String.format("%s/movie/now_playing?api_key=%s&language=en-US&page=1", baseUrl, apiKey);
                TmdbSearchResponse response = restTemplate.getForObject(url, TmdbSearchResponse.class);
                if (response != null && response.getResults() != null) {
                    return formatSummaries(response.getResults());
                }
            } catch (Exception e) {
                // Fallback on error
            }
        }
        return getMockMovies();
    }

    public List<TmdbMovieSummary> getPopular() {
        if (isRealApiKeyConfigured()) {
            try {
                String url = String.format("%s/movie/popular?api_key=%s&language=en-US&page=1", baseUrl, apiKey);
                TmdbSearchResponse response = restTemplate.getForObject(url, TmdbSearchResponse.class);
                if (response != null && response.getResults() != null) {
                    return formatSummaries(response.getResults());
                }
            } catch (Exception e) { }
        }
        return getMockMovies();
    }

    public List<TmdbMovieSummary> getUpcoming() {
        if (isRealApiKeyConfigured()) {
            try {
                String url = String.format("%s/movie/upcoming?api_key=%s&language=en-US&page=1", baseUrl, apiKey);
                TmdbSearchResponse response = restTemplate.getForObject(url, TmdbSearchResponse.class);
                if (response != null && response.getResults() != null) {
                    return formatSummaries(response.getResults());
                }
            } catch (Exception e) { }
        }
        return getMockMovies();
    }

    public List<TmdbMovieSummary> getTopRated() {
        if (isRealApiKeyConfigured()) {
            try {
                String url = String.format("%s/movie/top_rated?api_key=%s&language=en-US&page=1", baseUrl, apiKey);
                TmdbSearchResponse response = restTemplate.getForObject(url, TmdbSearchResponse.class);
                if (response != null && response.getResults() != null) {
                    return formatSummaries(response.getResults());
                }
            } catch (Exception e) { }
        }
        return getMockMovies();
    }

    public List<TmdbMovieSummary> getBollywoodMovies() {
        if (isRealApiKeyConfigured()) {
            try {
                List<TmdbMovieSummary> all = new ArrayList<>();
                // Page 1
                String url1 = String.format("%s/discover/movie?api_key=%s&with_original_language=hi&sort_by=popularity.desc&page=1", baseUrl, apiKey);
                TmdbSearchResponse res1 = restTemplate.getForObject(url1, TmdbSearchResponse.class);
                if (res1 != null && res1.getResults() != null) {
                    all.addAll(formatSummaries(res1.getResults()));
                }
                // Page 2
                String url2 = String.format("%s/discover/movie?api_key=%s&with_original_language=hi&sort_by=popularity.desc&page=2", baseUrl, apiKey);
                TmdbSearchResponse res2 = restTemplate.getForObject(url2, TmdbSearchResponse.class);
                if (res2 != null && res2.getResults() != null) {
                    all.addAll(formatSummaries(res2.getResults()));
                }
                return all;
            } catch (Exception e) { }
        }
        return Collections.emptyList();
    }

    public List<TmdbMovieSummary> getIndianMovies() {
        if (isRealApiKeyConfigured()) {
            try {
                String url = String.format("%s/discover/movie?api_key=%s&with_original_language=te&sort_by=popularity.desc&page=1", baseUrl, apiKey);
                TmdbSearchResponse response = restTemplate.getForObject(url, TmdbSearchResponse.class);
                if (response != null && response.getResults() != null) {
                    return formatSummaries(response.getResults());
                }
            } catch (Exception e) { }
        }
        return Collections.emptyList();
    }

    public List<Movie> syncPopularMovies() {
        List<Movie> imported = new ArrayList<>();
        Set<Long> processedTmdbIds = new HashSet<>();

        // 1. Bollywood / Hindi Cinema Blockbusters (Real TMDB IDs)
        List<Long> bollywoodIds = List.of(
            1112426L, // Stree 2
            872906L,  // Jawan
            864692L,  // Pathaan
            781732L,  // Animal
            801688L,  // Kalki 2898 AD
            1196943L, // Chhaava
            1213898L, // Border 2
            1169516L, // Welcome to the Jungle
            1239134L, // Bhooth Bangla
            12259L,   // Sholay
            360814L   // Dangal
        );

        int count = 0;
        for (Long bId : bollywoodIds) {
            if (processedTmdbIds.add(bId)) {
                String status = (count % 2 == 0) ? "Now Showing" : "Trending";
                try {
                    imported.add(importMovieByTmdbId(bId, status));
                } catch (Exception e) { }
                count++;
            }
        }

        // 2. Now Showing Global
        List<TmdbMovieSummary> nowPlaying = getNowPlaying();
        count = 0;
        for (TmdbMovieSummary summary : nowPlaying) {
            if (count >= 8) break;
            if (summary.getId() != null && processedTmdbIds.add(summary.getId())) {
                try {
                    imported.add(importMovieByTmdbId(summary.getId(), "Now Showing", summary));
                } catch (Exception e) { }
                count++;
            }
        }

        // 3. Trending Global
        List<TmdbMovieSummary> popular = getPopular();
        count = 0;
        for (TmdbMovieSummary summary : popular) {
            if (count >= 8) break;
            if (summary.getId() != null && processedTmdbIds.add(summary.getId())) {
                try {
                    imported.add(importMovieByTmdbId(summary.getId(), "Trending", summary));
                } catch (Exception e) { }
                count++;
            }
        }

        // 4. Upcoming Movies
        List<TmdbMovieSummary> upcoming = getUpcoming();
        count = 0;
        for (TmdbMovieSummary summary : upcoming) {
            if (count >= 8) break;
            if (summary.getId() != null && processedTmdbIds.add(summary.getId())) {
                try {
                    imported.add(importMovieByTmdbId(summary.getId(), "Upcoming", summary));
                } catch (Exception e) { }
                count++;
            }
        }

        // 5. Top Rated Movies
        List<TmdbMovieSummary> topRated = getTopRated();
        count = 0;
        for (TmdbMovieSummary summary : topRated) {
            if (count >= 8) break;
            if (summary.getId() != null && processedTmdbIds.add(summary.getId())) {
                try {
                    imported.add(importMovieByTmdbId(summary.getId(), "Recommended", summary));
                } catch (Exception e) { }
                count++;
            }
        }

        return imported;
    }

    public Movie importMovieByTmdbId(Long tmdbId) {
        return importMovieByTmdbId(tmdbId, "Now Showing", null);
    }

    public Movie importMovieByTmdbId(Long tmdbId, String releaseStatus) {
        return importMovieByTmdbId(tmdbId, releaseStatus, null);
    }

    @org.springframework.cache.annotation.CacheEvict(value = {"movies", "movie-by-id"}, allEntries = true)
    public Movie importMovieByTmdbId(Long tmdbId, String releaseStatus, TmdbMovieSummary summary) {
        String movieId = "tmdb-" + tmdbId;

        Optional<Movie> existing = movieRepository.findById(movieId);
        if (existing.isPresent()) {
            Movie m = existing.get();
            if (releaseStatus != null && !releaseStatus.isBlank()) {
                m.setReleaseStatus(releaseStatus);
                movieRepository.save(m);
            }
            return m;
        }

        TmdbMovieDetail detail = fetchMovieDetails(tmdbId, summary);
        if (detail == null) {
            throw new RuntimeException("Could not fetch details for TMDB ID: " + tmdbId);
        }

        Set<String> genres = new HashSet<>();
        if (detail.getGenres() != null) {
            genres = detail.getGenres().stream().map(TmdbGenre::getName).collect(Collectors.toSet());
        }
        if (genres.isEmpty()) genres.add("Action");

        Set<String> formats = Set.of("2D", "3D", "IMAX 3D", "Dolby Atmos");

        List<String> castList = new ArrayList<>();
        List<String> crewList = new ArrayList<>();
        if (detail.getCredits() != null) {
            if (detail.getCredits().getCast() != null) {
                castList = detail.getCredits().getCast().stream()
                        .limit(5)
                        .map(TmdbCast::getName)
                        .collect(Collectors.toList());
            }
            if (detail.getCredits().getCrew() != null) {
                crewList = detail.getCredits().getCrew().stream()
                        .filter(c -> "Director".equalsIgnoreCase(c.getJob()) || "Producer".equalsIgnoreCase(c.getJob()))
                        .limit(3)
                        .map(c -> c.getJob() + ": " + c.getName())
                        .collect(Collectors.toList());
            }
        }
        if (castList.isEmpty()) castList = List.of("Lead Actor", "Co-Star");
        if (crewList.isEmpty()) crewList = List.of("Director: Visionary Director");

        String trailerUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        if (detail.getVideos() != null && detail.getVideos().getResults() != null) {
            for (TmdbVideo v : detail.getVideos().getResults()) {
                if ("YouTube".equalsIgnoreCase(v.getSite()) && ("Trailer".equalsIgnoreCase(v.getType()) || "Teaser".equalsIgnoreCase(v.getType()))) {
                    trailerUrl = "https://www.youtube.com/watch?v=" + v.getKey();
                    break;
                }
            }
        }

        String posterUrl = formatPosterUrl(detail.getPosterPath());
        String backdropUrl = formatBackdropUrl(detail.getBackdropPath());
        String rawOverview = detail.getOverview() != null ? detail.getOverview() : "Exciting cinema release.";
        if (rawOverview.length() > 1200) {
            rawOverview = rawOverview.substring(0, 1190) + "...";
        }

        Movie movie = Movie.builder()
                .id(movieId)
                .title(detail.getTitle() != null ? detail.getTitle() : "TMDB Movie #" + tmdbId)
                .language(mapLanguage(detail.getOriginalLanguage()))
                .rating(detail.getVoteAverage() != null ? Math.round(detail.getVoteAverage() * 10.0) / 10.0 : 8.2)
                .votes(detail.getVoteCount() != null ? detail.getVoteCount() : 15000)
                .runtimeMins(detail.getRuntime() != null && detail.getRuntime() > 0 ? detail.getRuntime() : 145)
                .certification("UA")
                .releaseStatus(releaseStatus != null ? releaseStatus : "Now Showing")
                .synopsis(rawOverview)
                .posterUrl(posterUrl)
                .backdropUrl(backdropUrl)
                .trailerUrl(trailerUrl)
                .genre(genres)
                .format(formats)
                .cast(castList)
                .crew(crewList)
                .build();

        Movie saved = movieRepository.save(movie);

        // Auto-generate shows for this newly imported movie across existing theaters
        autoCreateShowsForMovie(saved);

        return saved;
    }

    private void autoCreateShowsForMovie(Movie movie) {
        List<Theater> theaters = theaterRepository.findAll();
        if (theaters.isEmpty()) return;

        LocalDate today = LocalDate.now();
        List<LocalDate> dates = List.of(today, today.plusDays(1), today.plusDays(2));
        String[] times = {"11:00", "15:30", "19:15", "22:00"};

        List<Show> newShows = new ArrayList<>();
        for (Theater theater : theaters) {
            for (LocalDate date : dates) {
                for (String time : times) {
                    String showId = "s-" + movie.getId() + "-" + theater.getId() + "-" + date.toString() + "-" + time.replace(":", "");
                    if (!showRepository.existsById(showId)) {
                        newShows.add(Show.builder()
                                .id(showId)
                                .movie(movie)
                                .theater(theater)
                                .date(date)
                                .time(time)
                                .basePrice(BigDecimal.valueOf(320))
                                .build());
                    }
                }
            }
        }
        if (!newShows.isEmpty()) {
            showRepository.saveAll(newShows);
        }
    }

    private TmdbMovieDetail fetchMovieDetails(Long tmdbId, TmdbMovieSummary summary) {
        if (isRealApiKeyConfigured()) {
            try {
                String url = String.format("%s/movie/%d?api_key=%s&append_to_response=credits,videos&language=en-US",
                        baseUrl, tmdbId, apiKey);
                TmdbMovieDetail detail = restTemplate.getForObject(url, TmdbMovieDetail.class);
                if (detail != null && detail.getTitle() != null) {
                    return detail;
                }
            } catch (Exception e) {
                // Fallback to summary
            }
        }

        TmdbMovieDetail detail = new TmdbMovieDetail();
        detail.setId(tmdbId);
        if (summary != null) {
            detail.setTitle(summary.getTitle());
            detail.setOverview(summary.getOverview());
            detail.setPosterPath(summary.getPosterPath());
            detail.setBackdropPath(summary.getBackdropPath());
            detail.setReleaseDate(summary.getReleaseDate());
            detail.setVoteAverage(summary.getVoteAverage());
            detail.setVoteCount(summary.getVoteCount());
            detail.setOriginalLanguage(summary.getOriginalLanguage());
        } else {
            detail.setTitle("TMDB Movie #" + tmdbId);
        }
        return detail;
    }

    private boolean isRealApiKeyConfigured() {
        return apiKey != null && !apiKey.isBlank() && !"DEMO_KEY".equalsIgnoreCase(apiKey) && !"YOUR_TMDB_API_KEY".equalsIgnoreCase(apiKey);
    }

    private List<TmdbMovieSummary> formatSummaries(List<TmdbMovieSummary> summaries) {
        for (TmdbMovieSummary s : summaries) {
            s.setPosterPath(formatPosterUrl(s.getPosterPath()));
            s.setBackdropPath(formatBackdropUrl(s.getBackdropPath()));
        }
        return summaries;
    }

    private String formatPosterUrl(String path) {
        if (path == null || path.isBlank()) return "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
        if (path.startsWith("http")) return path;
        return imageBaseUrl + "/w500" + path;
    }

    private String formatBackdropUrl(String path) {
        if (path == null || path.isBlank()) return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1400&auto=format&fit=crop";
        if (path.startsWith("http")) return path;
        return imageBaseUrl + "/original" + path;
    }

    private String mapLanguage(String code) {
        if (code == null) return "English";
        switch (code.toLowerCase()) {
            case "hi": return "Hindi";
            case "te": return "Telugu";
            case "ta": return "Tamil";
            case "kn": return "Kannada";
            case "ml": return "Malayalam";
            case "es": return "Spanish";
            case "fr": return "French";
            case "ja": return "Japanese";
            case "ko": return "Korean";
            default: return "English";
        }
    }

    // Curated TMDB Data including Bollywood & Global Cinema
    private List<TmdbMovieSummary> getMockMovies() {
        List<TmdbMovieSummary> list = new ArrayList<>();

        list.add(createSummary(1081003L, "Stree 2: Sarkate Ka Aatank", "The town of Chanderi is once again haunted by a terrifying headless entity that abducts women. Vicky and his loyal friends must team up with the mysterious Stree to defeat the evil spirit.", "/m7b1mC33nS3n8s7aKk6S4e6G2tH.jpg", "/2meX5jKyRFrm9yq5B62pyanXTG5.jpg", "2024-08-15", 8.2, 12500, "hi"));
        list.add(createSummary(866398L, "Jawan", "A driven man sets out to rectify the wrongs in society with a team of skilled women, facing off against a ruthless arms dealer who ruined his past.", "/jC1N5k4nJ7TjKk4j5ZkX2y3v4w1.jpg", "/vL5LR6WdxWPjUnFRiW3pjZGlS0o.jpg", "2023-09-07", 8.4, 28000, "hi"));
        list.add(createSummary(862552L, "Pathaan", "An Indian secret agent races against time to stop a mercenary group from launching a deadly biological attack on India.", "/mno4b3v2c1Xk5J7TjKk4j5ZkX2y.jpg", "/8ZTVqvTZmMe8YweGvWwYhRex52L.jpg", "2023-01-25", 8.1, 31000, "hi"));
        list.add(createSummary(781732L, "Animal", "A son's intense and obsessive love for his father leads him down a violent path of bloodshed, vengeance and organized crime.", "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", "/yDHYTfA3R0jFYba16jBB1q8jZAU.jpg", "2023-12-01", 7.9, 22000, "hi"));
        list.add(createSummary(820693L, "Kalki 2898 AD", "A modern avatar of Lord Vishnu descends to Earth to protect humanity against evil forces in a futuristic post-apocalyptic world.", "/3sgnSfNT27Bx5O5ukr7B26mhEQq.jpg", "/ezbrL1dMymKQZw7mDEWa2ZTzN7d.jpg", "2024-06-27", 8.3, 19000, "hi"));
        list.add(createSummary(19404L, "Dilwale Dulhania Le Jayenge", "Raj and Simran meet on a trip across Europe and fall in love. But when Simran's conservative father takes her back to India for an arranged marriage, Raj follows her.", "/tFbfCkS7q6g96wVoAu8kyr93iPm.jpg", "/95sjD0dRajtU6SKD6Gq6PtrGoGY.jpg", "1995-10-20", 8.5, 34000, "hi"));
        list.add(createSummary(579974L, "RRR", "A fearless revolutionary and an officer in the British force join hands to forge an uncharted path to freedom against oppression.", "/w2PMyoyLU22YvrGK3smVM9fW1jj.jpg", "/nNmJRkg8wWvFzpi28xL6g30Zg6U.jpg", "2022-03-25", 8.3, 42000, "te"));

        list.add(createSummary(27205L, "Inception", "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", "/oYuLEW9WAFK1BF2vR2d9DEfvwM0.jpg", "/8ZTVqvTZmMe8YweGvWwYhRex52L.jpg", "2010-07-16", 8.4, 35000, "en"));
        list.add(createSummary(76600L, "Avatar: The Way of Water", "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work with Neytiri and the army of the Na'vi race.", "/t6HIfvMGNVChM2yZStxc22XZiCh.jpg", "/vL5LR6WdxWPjUnFRiW3pjZGlS0o.jpg", "2022-12-16", 7.6, 11500, "en"));
        list.add(createSummary(693134L, "Dune: Part Two", "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.", "/1pdfLvkbY8ohJlCjQH2CZjjYVvJ.jpg", "/xOMo8BRK7PfcJv9JCnx7s52SuTx.jpg", "2024-03-01", 8.5, 5200, "en"));
        list.add(createSummary(872585L, "Oppenheimer", "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.", "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg", "2023-07-21", 8.1, 8800, "en"));
        list.add(createSummary(569094L, "Spider-Man: Across the Spider-Verse", "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.", "/8Vt6mWEReuy4Of61Lnj5Xj7sFm8.jpg", "/4XM82xNS82Z2P2909M1nE263P5e.jpg", "2023-06-02", 8.4, 6400, "en"));
        list.add(createSummary(533535L, "Deadpool & Wolverine", "A listless Wade Wilson strives to adjust to civilian life. His days as the morally flexible mercenary, Deadpool, behind him.", "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", "/yDHYTfA3R0jFYba16jBB1q8jZAU.jpg", "2024-07-26", 7.7, 4300, "en"));

        return formatSummaries(list);
    }

    private TmdbMovieSummary createSummary(Long id, String title, String overview, String poster, String backdrop, String releaseDate, Double voteAvg, Integer voteCount, String lang) {
        TmdbMovieSummary summary = new TmdbMovieSummary();
        summary.setId(id);
        summary.setTitle(title);
        summary.setOverview(overview);
        summary.setPosterPath(poster);
        summary.setBackdropPath(backdrop);
        summary.setReleaseDate(releaseDate);
        summary.setVoteAverage(voteAvg);
        summary.setVoteCount(voteCount);
        summary.setOriginalLanguage(lang);
        return summary;
    }

    private TmdbMovieDetail getMockDetail(Long tmdbId) {
        List<TmdbMovieSummary> summaries = getMockMovies();
        TmdbMovieSummary match = summaries.stream()
                .filter(s -> s.getId().equals(tmdbId))
                .findFirst()
                .orElse(summaries.get(0));

        TmdbMovieDetail detail = new TmdbMovieDetail();
        detail.setId(match.getId());
        detail.setTitle(match.getTitle());
        detail.setOverview(match.getOverview());
        detail.setPosterPath(match.getPosterPath());
        detail.setBackdropPath(match.getBackdropPath());
        detail.setReleaseDate(match.getReleaseDate());
        detail.setVoteAverage(match.getVoteAverage());
        detail.setVoteCount(match.getVoteCount());
        detail.setOriginalLanguage(match.getOriginalLanguage());

        String director = "Christopher Nolan";
        String trailerKey = "YoHD9XEInc0";
        int runtime = 148;
        List<String> castNames = List.of("Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy");
        List<String> genreNames = List.of("Action", "Sci-Fi", "Adventure");

        if (tmdbId.equals(76600L)) { // Avatar 2
            director = "James Cameron";
            trailerKey = "d9MyW72ELq0";
            runtime = 192;
            castNames = List.of("Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang");
            genreNames = List.of("Action", "Sci-Fi", "Adventure");
        } else if (tmdbId.equals(693134L)) { // Dune 2
            director = "Denis Villeneuve";
            trailerKey = "Way9Dexny3w";
            runtime = 166;
            castNames = List.of("Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem");
            genreNames = List.of("Sci-Fi", "Adventure", "Drama");
        } else if (tmdbId.equals(872585L)) { // Oppenheimer
            director = "Christopher Nolan";
            trailerKey = "uYPbbksJxIg";
            runtime = 180;
            castNames = List.of("Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr.");
            genreNames = List.of("Drama", "History", "Biography");
        } else if (tmdbId.equals(569094L)) { // Spider-Verse
            director = "Joaquim Dos Santos";
            trailerKey = "cqGjhVJWtEg";
            runtime = 140;
            castNames = List.of("Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson");
            genreNames = List.of("Animation", "Action", "Sci-Fi");
        } else if (tmdbId.equals(533535L)) { // Deadpool & Wolverine
            director = "Shawn Levy";
            trailerKey = "73_1biulkYk";
            runtime = 128;
            castNames = List.of("Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Morena Baccarin");
            genreNames = List.of("Action", "Comedy", "Sci-Fi");
        } else if (tmdbId.equals(157336L)) { // Interstellar
            director = "Christopher Nolan";
            trailerKey = "zSWdZVtXT7E";
            runtime = 169;
            castNames = List.of("Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine");
            genreNames = List.of("Sci-Fi", "Drama", "Adventure");
        } else if (tmdbId.equals(558449L)) { // Gladiator II
            director = "Ridley Scott";
            trailerKey = "4rgIUyaOIhQ";
            runtime = 148;
            castNames = List.of("Paul Mescal", "Pedro Pascal", "Denzel Washington", "Connie Nielsen");
            genreNames = List.of("Action", "Drama", "History");
        }

        detail.setRuntime(runtime);

        List<TmdbGenre> genreList = new ArrayList<>();
        for (int i = 0; i < genreNames.size(); i++) {
            TmdbGenre g = new TmdbGenre();
            g.setId(i + 1);
            g.setName(genreNames.get(i));
            genreList.add(g);
        }
        detail.setGenres(genreList);

        TmdbCredits credits = new TmdbCredits();
        List<TmdbCast> castList = new ArrayList<>();
        for (String cName : castNames) {
            TmdbCast c = new TmdbCast();
            c.setName(cName);
            c.setCharacter("Lead");
            castList.add(c);
        }
        credits.setCast(castList);

        TmdbCrew cr = new TmdbCrew();
        cr.setName(director);
        cr.setJob("Director");
        credits.setCrew(List.of(cr));
        detail.setCredits(credits);

        TmdbVideos videos = new TmdbVideos();
        TmdbVideo v = new TmdbVideo();
        v.setKey(trailerKey);
        v.setSite("YouTube");
        v.setType("Trailer");
        videos.setResults(List.of(v));
        detail.setVideos(videos);

        return detail;
    }
}
