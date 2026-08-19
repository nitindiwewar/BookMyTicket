package com.movieticket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String mobile;

    private String countryCode;

    private String dob; // Date of Birth e.g. YYYY-MM-DD

    private Integer age;

    private String gender; // Male, Female, Other, Prefer not to say

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private Boolean emailVerified = false;

    private Boolean mobileVerified = false;

    private LocalDateTime createdAt;

    public User() {}

    public User(Long id, String name, String email, String password, String mobile, String countryCode, String dob, Integer age, String gender, Role role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.mobile = mobile;
        this.countryCode = countryCode;
        this.dob = dob;
        this.age = age;
        this.gender = gender;
        this.role = role;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.role == null) {
            this.role = Role.ROLE_USER;
        }
        if (this.countryCode == null) {
            this.countryCode = "+91";
        }
    }

    public enum Role {
        ROLE_USER,
        ROLE_ADMIN
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Boolean getEmailVerified() { return emailVerified != null && emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public Boolean getMobileVerified() { return mobileVerified != null && mobileVerified; }
    public void setMobileVerified(Boolean mobileVerified) { this.mobileVerified = mobileVerified; }

    public Boolean isFullyVerified() { return getEmailVerified() && getMobileVerified(); }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static UserBuilder builder() { return new UserBuilder(); }

    public static class UserBuilder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private String mobile;
        private String countryCode;
        private String dob;
        private Integer age;
        private String gender;
        private Role role;
        private Boolean emailVerified = false;
        private Boolean mobileVerified = false;
        private LocalDateTime createdAt;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder mobile(String mobile) { this.mobile = mobile; return this; }
        public UserBuilder countryCode(String countryCode) { this.countryCode = countryCode; return this; }
        public UserBuilder dob(String dob) { this.dob = dob; return this; }
        public UserBuilder age(Integer age) { this.age = age; return this; }
        public UserBuilder gender(String gender) { this.gender = gender; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder emailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; return this; }
        public UserBuilder mobileVerified(Boolean mobileVerified) { this.mobileVerified = mobileVerified; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            User u = new User(id, name, email, password, mobile, countryCode, dob, age, gender, role, createdAt);
            u.setEmailVerified(emailVerified);
            u.setMobileVerified(mobileVerified);
            return u;
        }
    }
}
