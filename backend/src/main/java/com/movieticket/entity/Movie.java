package com.movieticket.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "movies", indexes = {
    @Index(name = "idx_movies_language", columnList = "language"),
    @Index(name = "idx_movies_rel_status", columnList = "releaseStatus"),
    @Index(name = "idx_movies_rating", columnList = "rating")
})
public class Movie {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    private String language;
    private Double rating;
    private Integer votes;
    private Integer runtimeMins;
    private String certification;
    private String releaseStatus;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

    private String posterUrl;
    private String backdropUrl;
    private String trailerUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_genres", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "genre")
    private Set<String> genre = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_formats", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "format")
    private Set<String> format = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_cast", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "cast_member")
    private List<String> cast = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_crew", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "crew_member")
    private List<String> crew = new ArrayList<>();

    public Movie() {}

    public Movie(String id, String title, String language, Double rating, Integer votes, Integer runtimeMins, String certification, String releaseStatus, String synopsis, String posterUrl, String backdropUrl, String trailerUrl, Set<String> genre, Set<String> format, List<String> cast, List<String> crew) {
        this.id = id;
        this.title = title;
        this.language = language;
        this.rating = rating;
        this.votes = votes;
        this.runtimeMins = runtimeMins;
        this.certification = certification;
        this.releaseStatus = releaseStatus;
        this.synopsis = synopsis;
        this.posterUrl = posterUrl;
        this.backdropUrl = backdropUrl;
        this.trailerUrl = trailerUrl;
        if (genre != null) this.genre = genre;
        if (format != null) this.format = format;
        if (cast != null) this.cast = cast;
        if (crew != null) this.crew = crew;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getVotes() { return votes; }
    public void setVotes(Integer votes) { this.votes = votes; }

    public Integer getRuntimeMins() { return runtimeMins; }
    public void setRuntimeMins(Integer runtimeMins) { this.runtimeMins = runtimeMins; }

    public String getCertification() { return certification; }
    public void setCertification(String certification) { this.certification = certification; }

    public String getReleaseStatus() { return releaseStatus; }
    public void setReleaseStatus(String releaseStatus) { this.releaseStatus = releaseStatus; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getBackdropUrl() { return backdropUrl; }
    public void setBackdropUrl(String backdropUrl) { this.backdropUrl = backdropUrl; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public Set<String> getGenre() { return genre; }
    public void setGenre(Set<String> genre) { this.genre = genre; }

    public Set<String> getFormat() { return format; }
    public void setFormat(Set<String> format) { this.format = format; }

    public List<String> getCast() { return cast; }
    public void setCast(List<String> cast) { this.cast = cast; }

    public List<String> getCrew() { return crew; }
    public void setCrew(List<String> crew) { this.crew = crew; }

    public static MovieBuilder builder() { return new MovieBuilder(); }

    public static class MovieBuilder {
        private String id;
        private String title;
        private String language;
        private Double rating;
        private Integer votes;
        private Integer runtimeMins;
        private String certification;
        private String releaseStatus;
        private String synopsis;
        private String posterUrl;
        private String backdropUrl;
        private String trailerUrl;
        private Set<String> genre = new HashSet<>();
        private Set<String> format = new HashSet<>();
        private List<String> cast = new ArrayList<>();
        private List<String> crew = new ArrayList<>();

        public MovieBuilder id(String id) { this.id = id; return this; }
        public MovieBuilder title(String title) { this.title = title; return this; }
        public MovieBuilder language(String language) { this.language = language; return this; }
        public MovieBuilder rating(Double rating) { this.rating = rating; return this; }
        public MovieBuilder votes(Integer votes) { this.votes = votes; return this; }
        public MovieBuilder runtimeMins(Integer runtimeMins) { this.runtimeMins = runtimeMins; return this; }
        public MovieBuilder certification(String certification) { this.certification = certification; return this; }
        public MovieBuilder releaseStatus(String releaseStatus) { this.releaseStatus = releaseStatus; return this; }
        public MovieBuilder synopsis(String synopsis) { this.synopsis = synopsis; return this; }
        public MovieBuilder posterUrl(String posterUrl) { this.posterUrl = posterUrl; return this; }
        public MovieBuilder backdropUrl(String backdropUrl) { this.backdropUrl = backdropUrl; return this; }
        public MovieBuilder trailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; return this; }
        public MovieBuilder genre(Set<String> genre) { this.genre = genre; return this; }
        public MovieBuilder format(Set<String> format) { this.format = format; return this; }
        public MovieBuilder cast(List<String> cast) { this.cast = cast; return this; }
        public MovieBuilder crew(List<String> crew) { this.crew = crew; return this; }

        public Movie build() {
            return new Movie(id, title, language, rating, votes, runtimeMins, certification, releaseStatus, synopsis, posterUrl, backdropUrl, trailerUrl, genre, format, cast, crew);
        }
    }
}
