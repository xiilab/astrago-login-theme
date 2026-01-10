# Keycloak 26.x base image
FROM quay.io/keycloak/keycloak:26.0

# Switch to root for file operations
USER root

# Copy the built JAR file (Keycloakify 11.x output path)
COPY dist_keycloak/keycloak-theme.jar /opt/keycloak/providers/keycloak-theme.jar

# Set proper permissions
RUN chown -R 1000:1000 /opt/keycloak/providers/keycloak-theme.jar

# Switch back to keycloak user
USER 1000

# Expose the default Keycloak port
EXPOSE 8080

# Build the Keycloak server with providers
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start-dev"]
