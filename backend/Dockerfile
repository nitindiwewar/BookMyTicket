# ==========================================
# STAGE 1: Build Java Application with Maven
# ==========================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package application JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Lightweight Production JRE Runtime
# ==========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

# Expose Spring Boot port
EXPOSE 8080

# Configure JVM memory limits & garbage collector for containerized environment
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Run Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
