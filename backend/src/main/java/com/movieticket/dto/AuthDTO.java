package com.movieticket.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    public static class SendOtpRequest {
        @NotBlank(message = "Mobile number is required")
        private String mobile;
        private String countryCode = "+91";

        public SendOtpRequest() {}
        public SendOtpRequest(String mobile, String countryCode) {
            this.mobile = mobile;
            if (countryCode != null) this.countryCode = countryCode;
        }

        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }

        public String getCountryCode() { return countryCode; }
        public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
    }

    public static class VerifyOtpRequest {
        @NotBlank(message = "Mobile number is required")
        private String mobile;
        private String countryCode = "+91";

        @NotBlank(message = "OTP is required")
        private String otp;

        public VerifyOtpRequest() {}
        public VerifyOtpRequest(String mobile, String countryCode, String otp) {
            this.mobile = mobile;
            if (countryCode != null) this.countryCode = countryCode;
            this.otp = otp;
        }

        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }

        public String getCountryCode() { return countryCode; }
        public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }

    public static class CompleteProfileRequest {
        @NotBlank(message = "Mobile number is required")
        private String mobile;

        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        private String dob;
        private Integer age;
        private String gender;

        public CompleteProfileRequest() {}
        public CompleteProfileRequest(String mobile, String name, String email, String dob, Integer age, String gender) {
            this.mobile = mobile;
            this.name = name;
            this.email = email;
            this.dob = dob;
            this.age = age;
            this.gender = gender;
        }

        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getDob() { return dob; }
        public void setDob(String dob) { this.dob = dob; }

        public Integer getAge() { return age; }
        public void setAge(Integer age) { this.age = age; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
    }

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class GoogleAuthRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Name is required")
        private String name;

        private String sub;
        private String picture;

        public GoogleAuthRequest() {}
        public GoogleAuthRequest(String email, String name, String sub, String picture) {
            this.email = email;
            this.name = name;
            this.sub = sub;
            this.picture = picture;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSub() { return sub; }
        public void setSub(String sub) { this.sub = sub; }

        public String getPicture() { return picture; }
        public void setPicture(String picture) { this.picture = picture; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String mobile;
        private String countryCode;
        private String dob;
        private Integer age;
        private String gender;

        public RegisterRequest() {}
        public RegisterRequest(String name, String email, String password, String mobile, String countryCode) {
            this.name = name;
            this.email = email;
            this.password = password;
            this.mobile = mobile;
            this.countryCode = countryCode;
        }

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
    }

    public static class UpdateProfileRequest {
        @NotBlank(message = "Email is required and cannot be blank")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Full Name is required and cannot be blank")
        private String name;

        @NotBlank(message = "Mobile number is required and cannot be blank")
        private String mobile;

        private String countryCode;

        @NotBlank(message = "Date of Birth is required and cannot be blank")
        private String dob;

        private Integer age;

        @NotBlank(message = "Gender is required and cannot be blank")
        private String gender;

        public UpdateProfileRequest() {}
        public UpdateProfileRequest(String email, String name, String mobile, String countryCode, String dob, Integer age, String gender) {
            this.email = email;
            this.name = name;
            this.mobile = mobile;
            this.countryCode = countryCode;
            this.dob = dob;
            this.age = age;
            this.gender = gender;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

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
    }

    public static class SendEmailOtpRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        public SendEmailOtpRequest() {}
        public SendEmailOtpRequest(String email) { this.email = email; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class VerifyEmailOtpRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "OTP code is required")
        private String otp;

        public VerifyEmailOtpRequest() {}
        public VerifyEmailOtpRequest(String email, String otp) {
            this.email = email;
            this.otp = otp;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }

    public static class SendMobileOtpRequest {
        @NotBlank(message = "Mobile number is required")
        private String mobile;
        private String countryCode = "+91";

        public SendMobileOtpRequest() {}
        public SendMobileOtpRequest(String mobile, String countryCode) {
            this.mobile = mobile;
            if (countryCode != null) this.countryCode = countryCode;
        }

        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }

        public String getCountryCode() { return countryCode; }
        public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
    }

    public static class VerifyMobileOtpRequest {
        @NotBlank(message = "Mobile number is required")
        private String mobile;

        @NotBlank(message = "OTP code is required")
        private String otp;

        public VerifyMobileOtpRequest() {}
        public VerifyMobileOtpRequest(String mobile, String otp) {
            this.mobile = mobile;
            this.otp = otp;
        }

        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }

        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }

    public static class AuthResponse {
        private String token;
        private String type;
        private Long id;
        private String name;
        private String email;
        private String mobile;
        private String countryCode;
        private String dob;
        private Integer age;
        private String gender;
        private String role;
        private boolean isNewUser;
        private boolean emailVerified;
        private boolean mobileVerified;

        public AuthResponse() {}
        public AuthResponse(String token, String type, Long id, String name, String email, String mobile, String countryCode, String dob, Integer age, String gender, String role, boolean isNewUser, boolean emailVerified, boolean mobileVerified) {
            this.token = token;
            this.type = type;
            this.id = id;
            this.name = name;
            this.email = email;
            this.mobile = mobile;
            this.countryCode = countryCode;
            this.dob = dob;
            this.age = age;
            this.gender = gender;
            this.role = role;
            this.isNewUser = isNewUser;
            this.emailVerified = emailVerified;
            this.mobileVerified = mobileVerified;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

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

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public boolean isNewUser() { return isNewUser; }
        public boolean getIsNewUser() { return isNewUser; }
        public void setNewUser(boolean newUser) { isNewUser = newUser; }

        public boolean isEmailVerified() { return emailVerified; }
        public boolean getEmailVerified() { return emailVerified; }
        public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

        public boolean isMobileVerified() { return mobileVerified; }
        public boolean getMobileVerified() { return mobileVerified; }
        public void setMobileVerified(boolean mobileVerified) { this.mobileVerified = mobileVerified; }

        public static AuthResponseBuilder builder() { return new AuthResponseBuilder(); }

        public static class AuthResponseBuilder {
            private String token;
            private String type;
            private Long id;
            private String name;
            private String email;
            private String mobile;
            private String countryCode;
            private String dob;
            private Integer age;
            private String gender;
            private String role;
            private boolean isNewUser;
            private boolean emailVerified;
            private boolean mobileVerified;

            public AuthResponseBuilder token(String token) { this.token = token; return this; }
            public AuthResponseBuilder type(String type) { this.type = type; return this; }
            public AuthResponseBuilder id(Long id) { this.id = id; return this; }
            public AuthResponseBuilder name(String name) { this.name = name; return this; }
            public AuthResponseBuilder email(String email) { this.email = email; return this; }
            public AuthResponseBuilder mobile(String mobile) { this.mobile = mobile; return this; }
            public AuthResponseBuilder countryCode(String countryCode) { this.countryCode = countryCode; return this; }
            public AuthResponseBuilder dob(String dob) { this.dob = dob; return this; }
            public AuthResponseBuilder age(Integer age) { this.age = age; return this; }
            public AuthResponseBuilder gender(String gender) { this.gender = gender; return this; }
            public AuthResponseBuilder role(String role) { this.role = role; return this; }
            public AuthResponseBuilder isNewUser(boolean isNewUser) { this.isNewUser = isNewUser; return this; }
            public AuthResponseBuilder emailVerified(boolean emailVerified) { this.emailVerified = emailVerified; return this; }
            public AuthResponseBuilder mobileVerified(boolean mobileVerified) { this.mobileVerified = mobileVerified; return this; }

            public AuthResponse build() {
                return new AuthResponse(token, type, id, name, email, mobile, countryCode, dob, age, gender, role, isNewUser, emailVerified, mobileVerified);
            }
        }
    }
}
