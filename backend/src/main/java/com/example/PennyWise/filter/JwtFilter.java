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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")
        ) {
            filterChain.doFilter(request, response);
            return;
        }
        String token =
                authHeader.substring(7);
        String username = null;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception e) {
            System.out.println("JWT extraction failed: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails;
            try {
                userDetails = userDetailsService.loadUserByUsername(username);
            } catch (Exception e) {
                System.out.println("User loading failed: " + e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }

            if (jwtService.isTokenValid(token, userDetails)) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
                System.out.println(
                        "JWT authentication successful for user: " + username);
            } else {

                System.out.println("JWT validation failed for user: " + username);
            }
        }
        filterChain.doFilter(request, response);
    }
}