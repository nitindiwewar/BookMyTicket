package com.movieticket.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "theaters", indexes = {
    @Index(name = "idx_theaters_city", columnList = "city")
})
public class Theater {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String area;
    private String city;

    private Double latitude;
    private Double longitude;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "theater_facilities", joinColumns = @JoinColumn(name = "theater_id"))
    @Column(name = "facility")
    private List<String> facilities = new ArrayList<>();

    public Theater() {}

    public Theater(String id, String name, String area, String city, Double latitude, Double longitude, List<String> facilities) {
        this.id = id;
        this.name = name;
        this.area = area;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        if (facilities != null) this.facilities = facilities;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public List<String> getFacilities() { return facilities; }
    public void setFacilities(List<String> facilities) { this.facilities = facilities; }

    public static TheaterBuilder builder() { return new TheaterBuilder(); }

    public static class TheaterBuilder {
        private String id;
        private String name;
        private String area;
        private String city;
        private Double latitude;
        private Double longitude;
        private List<String> facilities = new ArrayList<>();

        public TheaterBuilder id(String id) { this.id = id; return this; }
        public TheaterBuilder name(String name) { this.name = name; return this; }
        public TheaterBuilder area(String area) { this.area = area; return this; }
        public TheaterBuilder city(String city) { this.city = city; return this; }
        public TheaterBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public TheaterBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public TheaterBuilder facilities(List<String> facilities) { this.facilities = facilities; return this; }

        public Theater build() {
            return new Theater(id, name, area, city, latitude, longitude, facilities);
        }
    }
}
