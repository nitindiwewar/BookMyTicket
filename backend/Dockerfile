# =========================================================
# Stage 1: Build Spring Boot Backend with Maven
# =========================================================
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# =========================================================
# Stage 2: Minimal Alpine Java Runtime for Production
# =========================================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy compiled JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose HTTP Port
EXPOSE 8080
ENV PORT=8080

# Execute Spring Boot Application
ENTRYPOINT ["java", "-jar", "app.jar"]
