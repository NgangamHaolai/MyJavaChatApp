package com.example.mychatappv4.controller;

import com.example.mychatappv4.dto.AuthenticationResponse;
import com.example.mychatappv4.model.RegisterUserRequest;
import com.example.mychatappv4.model.User;
import com.example.mychatappv4.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// @RequestMapping("/auth")
public class AuthenticationController
{
    @Autowired
    private AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterUserRequest request)
    {
        System.out.println("reached...");
        return ResponseEntity.ok(authService.register(request));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody User request)
    {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
