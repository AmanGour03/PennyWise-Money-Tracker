package com.example.PennyWise.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PennyWise Money Traceker API")
                        .description("Money Management System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Aman Gour")
                                .email("amangourtemp@gmail.con")))
                .addSecurityItem(new SecurityRequirement()
                        .addList("BearerAuth"))
                .components(new Components()
                .addSecuritySchemes("BearerAuth", new SecurityScheme()
                        .name("Authorization")
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer").bearerFormat("JWT")));
    }
}
