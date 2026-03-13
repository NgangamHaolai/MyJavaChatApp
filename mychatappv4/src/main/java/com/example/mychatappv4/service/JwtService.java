package com.example.mychatappv4.service;

import com.example.mychatappv4.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService
{
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    public <T>T extractClaim(String token, Function<Claims, T> resolver)
    {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }
    public String extractUsername(String token)
    {
        return extractClaim(token, Claims::getSubject);
    }
    private Date extractExpiration(String token)
    {
        return extractClaim(token, Claims::getExpiration);
    }
    private boolean isTokenExpired(String token)
    {
        return extractExpiration(token).before(new Date());
    }
    public boolean isValid(String token, UserDetails userDetails)
    {
        String username = userDetails.getUsername();
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }
    private Claims extractAllClaims(String token)
    {
        return Jwts.parserBuilder()
                .setSigningKey(getSigninKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public String generateToken(User user)
    {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("id", user.getId())
//                .claim("userName", user.getUsername())    // don't need it as subject as username is the best practice
                .setExpiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .signWith(getSigninKey())
                .compact();
    }
    private Key getSigninKey()
    {
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}