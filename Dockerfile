FROM quay.io/keycloak/keycloak:26.4.7

USER root

COPY build_keycloak/target/keycloak-theme.jar /opt/keycloak/providers/keycloak-theme.jar

RUN chown -R 1000:0 /opt/keycloak/providers/keycloak-theme.jar \
    && chmod 0644 /opt/keycloak/providers/keycloak-theme.jar \
    && /opt/keycloak/bin/kc.sh build

USER 1000

EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start"]
