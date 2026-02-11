package com.example.mychatappv4.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Data
public class User implements UserDetails    // a Spring Security interface // represents “A user that Spring Security can authenticate and authorize”
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password", unique = true, nullable = false)
    private String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() // inbuilt method from UserDetails
    {
        return List.of();
    }
    @Override
    public String getUsername() // inbuilt method from UserDetails
    {
        return username;
    }
}
