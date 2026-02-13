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

//    @Column(name = "name", nullable = false)
//    private String name;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() // inbuilt method from UserDetails
    {
        return List.of();
    }
    @Override // JARVIS says since we're using lombok we dont have to override but since its a security method it could be dangerous not to. In fact we should override all the methods since UserDetails is an interface. And also because it can lead to security issues.
    public String getUsername() // inbuilt method from UserDetails
    {
        return username;
    }
}
