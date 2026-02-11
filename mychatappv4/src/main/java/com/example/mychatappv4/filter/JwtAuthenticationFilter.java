package com.example.mychatappv4.filter;

import com.example.mychatappv4.service.JwtService;
import com.example.mychatappv4.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter
{
    private final JwtService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override       //request → incoming request  //response → outgoing response
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization"); //filterChain → passes control to next filter
        if(authHeader==null || !authHeader.startsWith("Bearer "))
        {
            filterChain.doFilter(request, response);
            return;
        }
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null) //📌 Prevents re-authentication on same request
        {   //Spring Security works with UserDetails
            UserDetails userDetails = userService.loadUserByUsername(username);
            if(jwtService.isValid(token, userDetails))
            {   //principal → authenticated user
                // credentials → null (JWT already verified)
                // authorities → roles/permissions
                // 📌 This object represents a logged-in user
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); //Attach Request Details
                SecurityContextHolder.getContext().setAuthentication(authToken); //Tells Spring:“User is authenticated”
            }
        }
        filterChain.doFilter(request, response); //Pass control to: Next security filter
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException
    {
        String path = request.getServletPath();
        return request.getMethod().equalsIgnoreCase("OPTIONS") || path.startsWith("/auth/");
    }
}