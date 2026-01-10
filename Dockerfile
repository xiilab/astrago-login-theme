# Keycloak 26.x base image
FROM quay.io/keycloak/keycloak:26.0 AS builder

# Copy the built JAR file (Keycloakify 11.x output path)
COPY dist_keycloak/keycloak-theme.jar /opt/keycloak/providers/keycloak-theme.jar

# Build optimized Keycloak with theme provider
RUN /opt/keycloak/bin/kc.sh build

# Production image
FROM quay.io/keycloak/keycloak:26.0

# Copy built Keycloak from builder stage
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Expose the default Keycloak port
EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
