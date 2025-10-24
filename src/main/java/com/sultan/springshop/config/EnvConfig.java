package com.sultan.springshop.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {

    @PostConstruct
    public void init() {
        // Load .env file and set system properties
        Dotenv dotenv = Dotenv.configure()
                .directory(".") // Look for .env in the root directory
                .ignoreIfMissing() // Don't throw error if .env is missing (useful in production)
                .load();

        // Set each environment variable as a system property
        dotenv.entries().forEach(entry -> {
            if (System.getProperty(entry.getKey()) == null) { // Don't override existing system properties
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });
    }
}