package com.movieticket.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class TmdbDTOs {

    public static class TmdbSearchResponse {
        private int page;
        private List<TmdbMovieSummary> results;
        @JsonProperty("total_pages")
        private int totalPages;
        @JsonProperty("total_results")
        private int totalResults;

        public int getPage() { return page; }
        public void setPage(int page) { this.page = page; }
        public List<TmdbMovieSummary> getResults() { return results; }
        public void setResults(List<TmdbMovieSummary> results) { this.results = results; }
        public int getTotalPages() { return totalPages; }
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
        public int getTotalResults() { return totalResults; }
        public void setTotalResults(int totalResults) { this.totalResults = totalResults; }
    }

    public static class TmdbMovieSummary {
        private Long id;
        private String title;
        @JsonProperty("original_title")
        private String originalTitle;
        private String overview;
        @JsonProperty("poster_path")
        private String posterPath;
        @JsonProperty("backdrop_path")
        private String backdropPath;
        @JsonProperty("release_date")
        private String releaseDate;
        @JsonProperty("vote_average")
        private Double voteAverage;
        @JsonProperty("vote_count")
        private Integer voteCount;
        @JsonProperty("original_language")
        private String originalLanguage;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getOriginalTitle() { return originalTitle; }
        public void setOriginalTitle(String originalTitle) { this.originalTitle = originalTitle; }
        public String getOverview() { return overview; }
        public void setOverview(String overview) { this.overview = overview; }
        public String getPosterPath() { return posterPath; }
        public void setPosterPath(String posterPath) { this.posterPath = posterPath; }
        public String getBackdropPath() { return backdropPath; }
        public void setBackdropPath(String backdropPath) { this.backdropPath = backdropPath; }
        public String getReleaseDate() { return releaseDate; }
        public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }
        public Double getVoteAverage() { return voteAverage; }
        public void setVoteAverage(Double voteAverage) { this.voteAverage = voteAverage; }
        public Integer getVoteCount() { return voteCount; }
        public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }
        public String getOriginalLanguage() { return originalLanguage; }
        public void setOriginalLanguage(String originalLanguage) { this.originalLanguage = originalLanguage; }
    }

    public static class TmdbMovieDetail {
        private Long id;
        private String title;
        private String overview;
        @JsonProperty("poster_path")
        private String posterPath;
        @JsonProperty("backdrop_path")
        private String backdropPath;
        @JsonProperty("release_date")
        private String releaseDate;
        private Integer runtime;
        @JsonProperty("vote_average")
        private Double voteAverage;
        @JsonProperty("vote_count")
        private Integer voteCount;
        @JsonProperty("original_language")
        private String originalLanguage;
        private List<TmdbGenre> genres;
        private TmdbCredits credits;
        private TmdbVideos videos;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getOverview() { return overview; }
        public void setOverview(String overview) { this.overview = overview; }
        public String getPosterPath() { return posterPath; }
        public void setPosterPath(String posterPath) { this.posterPath = posterPath; }
        public String getBackdropPath() { return backdropPath; }
        public void setBackdropPath(String backdropPath) { this.backdropPath = backdropPath; }
        public String getReleaseDate() { return releaseDate; }
        public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }
        public Integer getRuntime() { return runtime; }
        public void setRuntime(Integer runtime) { this.runtime = runtime; }
        public Double getVoteAverage() { return voteAverage; }
        public void setVoteAverage(Double voteAverage) { this.voteAverage = voteAverage; }
        public Integer getVoteCount() { return voteCount; }
        public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }
        public String getOriginalLanguage() { return originalLanguage; }
        public void setOriginalLanguage(String originalLanguage) { this.originalLanguage = originalLanguage; }
        public List<TmdbGenre> getGenres() { return genres; }
        public void setGenres(List<TmdbGenre> genres) { this.genres = genres; }
        public TmdbCredits getCredits() { return credits; }
        public void setCredits(TmdbCredits credits) { this.credits = credits; }
        public TmdbVideos getVideos() { return videos; }
        public void setVideos(TmdbVideos videos) { this.videos = videos; }
    }

    public static class TmdbGenre {
        private Integer id;
        private String name;

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class TmdbCredits {
        private List<TmdbCast> cast;
        private List<TmdbCrew> crew;

        public List<TmdbCast> getCast() { return cast; }
        public void setCast(List<TmdbCast> cast) { this.cast = cast; }
        public List<TmdbCrew> getCrew() { return crew; }
        public void setCrew(List<TmdbCrew> crew) { this.crew = crew; }
    }

    public static class TmdbCast {
        private String name;
        private String character;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCharacter() { return character; }
        public void setCharacter(String character) { this.character = character; }
    }

    public static class TmdbCrew {
        private String name;
        private String job;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getJob() { return job; }
        public void setJob(String job) { this.job = job; }
    }

    public static class TmdbVideos {
        private List<TmdbVideo> results;

        public List<TmdbVideo> getResults() { return results; }
        public void setResults(List<TmdbVideo> results) { this.results = results; }
    }

    public static class TmdbVideo {
        private String key;
        private String site;
        private String type;

        public String getKey() { return key; }
        public void setKey(String key) { this.key = key; }
        public String getSite() { return site; }
        public void setSite(String site) { this.site = site; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }
}
