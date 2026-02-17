package com.example.mychatappv4.controller;

import com.example.mychatappv4.dto.AuthenticationResponse;
import com.example.mychatappv4.dto.LoginUserRequest;
import com.example.mychatappv4.dto.RegisterUserRequest;
import com.example.mychatappv4.service.AuthenticationServiceImpl;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
// @RequestMapping("/auth")
public class AuthenticationController
{
    @Autowired
    private AuthenticationServiceImpl authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterUserRequest request)
    {
        log.info("inside register() registerUserRequest: {}", request);
        return ResponseEntity.ok(authService.register(request));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody LoginUserRequest request)
    {
        log.info("inside authenticate() loginUserRequest: {}", request);
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
