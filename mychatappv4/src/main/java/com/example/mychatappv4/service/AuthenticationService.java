package com.example.mychatappv4.service;

import com.example.mychatappv4.dto.AuthenticationResponse;
import com.example.mychatappv4.model.RegisterUserRequest;
import com.example.mychatappv4.model.User;
import com.example.mychatappv4.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthenticationService
{
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private final ObjectMapper objectMapper;

    AuthenticationService(UserRepository userRepository, JwtService jwtService, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.objectMapper = objectMapper;
    }

    public AuthenticationResponse register(RegisterUserRequest request)
    {
        log.info("inside register()");
        log.info("data: {}",request);
        if(!request.getPassword().equals(request.getConfirmPassword()))
            throw new IllegalArgumentException("Passwords do not match");
        User user = objectMapper.convertValue(request, User.class);

//        User user = new User();
//        user.setName(request.getName());
//        user.setUsername(request.getUsername());
//        user.setEmail(request.getEmail());
//        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        String token = jwtService.generateToken(user);
        log.info("registration done.");
        return new AuthenticationResponse(token);
    }
    public AuthenticationResponse authenticate(User request)

    {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = (User) authentication.getPrincipal();   // alternate way. saves one DB call
//        String username = request.getUsername();
//        User user = userRepository.findByUserName(username);
        String token = jwtService.generateToken(user);
        return new AuthenticationResponse(token);
    }
}