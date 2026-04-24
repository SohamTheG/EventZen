# --- Stage 1: Build ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src
# Build the application, skipping tests to speed up the container build
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy only the compiled JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar
# Expose the single gateway port
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]