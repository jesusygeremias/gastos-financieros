package com.jesusygeremias.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    private final JdbcTemplate jdbcTemplate;

    public SecurityConfig(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated()
                )
                .formLogin(withDefaults())
                .httpBasic(withDefaults());
        return http.build();
    }


    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            var user = jdbcTemplate.queryForObject(
                    "SELECT username, password, enabled FROM users WHERE username = ?",
                    (rs, rowNum) -> org.springframework.security.core.userdetails.User
                            .withUsername(rs.getString("username"))
                            .password(rs.getString("password"))
                            .disabled(!rs.getBoolean("enabled"))
                            .authorities("USER") // requerido por Spring, aunque no lo uses
                            .build(),
                    username
            );

            if (user == null) {
                throw new UsernameNotFoundException("Usuario no encontrado");
            }
            return user;
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
