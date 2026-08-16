package com.example.PennyWise.filter;

import com.example.PennyWise.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        // =================================================
        // 1. Get Authorization header
        // =================================================

        String authHeader =
                request.getHeader("Authorization");


        // =================================================
        // 2. Check Bearer token
        // =================================================

        if (
                authHeader == null ||
                        !authHeader.startsWith("Bearer ")
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =================================================
        // 3. Extract JWT
        // =================================================

        String token =
                authHeader.substring(7);


        String username = null;


        // =================================================
        // 4. Extract username
        // =================================================

        try {

            username =
                    jwtService.extractUsername(token);

        } catch (Exception e) {

            System.out.println(
                    "JWT extraction failed: "
                            + e.getMessage()
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =================================================
        // 5. Check whether authentication already exists
        // =================================================

        if (
                username != null &&
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication() == null
        ) {


            // =============================================
            // 6. Load user from database
            // =============================================

            UserDetails userDetails;

            try {

                userDetails =
                        userDetailsService
                                .loadUserByUsername(
                                        username
                                );

            } catch (Exception e) {

                System.out.println(
                        "User loading failed: "
                                + e.getMessage()
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // =============================================
            // 7. Validate JWT
            // =============================================

            if (
                    jwtService.isTokenValid(
                            token,
                            userDetails
                    )
            ) {


                // =========================================
                // 8. Create authentication
                // =========================================

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );


                // =========================================
                // 9. Add request details
                // =========================================

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );


                // =========================================
                // 10. Set authentication
                // =========================================

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );


                System.out.println(
                        "JWT authentication successful for user: "
                                + username
                );

            } else {

                System.out.println(
                        "JWT validation failed for user: "
                                + username
                );
            }
        }


        // =================================================
        // 11. Continue request
        // =================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}