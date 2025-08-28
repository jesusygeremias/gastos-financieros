package com.jesusygeremias.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Gastos App")
                        .version("1.0.0")
                        .description("API para gestión de gastos mensuales")
                        .contact(new Contact().name("Sergio Ruiz").url("https://github.com/jesusygeremias")))
                .externalDocs(new ExternalDocumentation()
                        .description("Documentación adicional")
                        .url("https://example.com"));
    }
}
