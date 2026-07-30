package com.movieticket.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "snacks")
public class Snack {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(nullable = false)
    private BigDecimal price;

    private String description;
    private String calories;

    public Snack() {}

    public Snack(String id, String name, String category, BigDecimal price, String description, String calories) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.description = description;
        this.calories = calories;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCalories() { return calories; }
    public void setCalories(String calories) { this.calories = calories; }

    public static SnackBuilder builder() { return new SnackBuilder(); }

    public static class SnackBuilder {
        private String id;
        private String name;
        private String category;
        private BigDecimal price;
        private String description;
        private String calories;

        public SnackBuilder id(String id) { this.id = id; return this; }
        public SnackBuilder name(String name) { this.name = name; return this; }
        public SnackBuilder category(String category) { this.category = category; return this; }
        public SnackBuilder price(BigDecimal price) { this.price = price; return this; }
        public SnackBuilder description(String description) { this.description = description; return this; }
        public SnackBuilder calories(String calories) { this.calories = calories; return this; }

        public Snack build() {
            return new Snack(id, name, category, price, description, calories);
        }
    }
}
