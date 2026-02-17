package com.example.mychatappv4.config;

import com.example.mychatappv4.service.JwtService;
import com.example.mychatappv4.service.UserServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

class Delete extends OncePerRequestFilter
{
    private final JwtService jwtService;
    private final User user;
    private final UserServiceImpl userService;
    @Autowired
    Delete(JwtService jwtService, User user, UserServiceImpl userService) {
        this.jwtService = jwtService;
        this.user = user;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException
    {
        String header = request.getHeader("Authorization");
        if(header==null || !header.startsWith("Bearer "))
        {
            filterChain.doFilter(request,response);
            return;
        }
        String token = header.substring(7);
        String username = jwtService.extractUsername(token);
        UserDetails userDetails = userService.loadUserByUsername(username);
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {
            if(jwtService.isValid(username, userDetails))
            {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(username, null, user.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }

}