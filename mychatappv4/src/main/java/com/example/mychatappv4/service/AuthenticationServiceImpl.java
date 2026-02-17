package com.example.mychatappv4.service;

import com.example.mychatappv4.dto.AuthenticationResponse;
import com.example.mychatappv4.dto.LoginUserRequest;
import com.example.mychatappv4.dto.RegisterUserRequest;
import com.example.mychatappv4.errors.DuplicateEmailException;
import com.example.mychatappv4.errors.DuplicateUsernameException;
import com.example.mychatappv4.errors.PasswordMismatchException;
import com.example.mychatappv4.model.User;
import com.example.mychatappv4.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthenticationServiceImpl implements AuthenticationService
{
    private final UserRepository userRepository;
    private final UserServiceImpl userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final ObjectMapper objectMapper;

    AuthenticationServiceImpl(UserRepository userRepository, UserServiceImpl userService, JwtService jwtService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, ObjectMapper objectMapper)
    {
        this.userRepository = userRepository;
        this.userService = userService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.objectMapper = objectMapper;
    }

    public AuthenticationResponse register(RegisterUserRequest request)
    {
        log.info("inside register()");
        log.info("data: {}",request);

        boolean usernameExists = userRepository.existsByUsername(request.getUsername());
        if(usernameExists)
            throw new DuplicateUsernameException("username already exists");
        boolean emailExists = userRepository.existsByEmail(request.getEmail());
        if(emailExists)
            throw new DuplicateEmailException("user with email already exists");
        if(!request.getPassword().equals(request.getConfirmPassword()))
            throw new PasswordMismatchException("Passwords do not match");

        User user = objectMapper.convertValue(request, User.class);
//        User user = new User();
//        user.setName(request.getName());
//        user.setUsername(request.getUsername());
//        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        String token = jwtService.generateToken(user);
        log.info("registration done.");
        return new AuthenticationResponse(token);
    }
    public AuthenticationResponse authenticate(LoginUserRequest request)
    {
        log.info("inside authenticate() {}", request);
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = (User) authentication.getPrincipal();   // alternate way. saves one DB call
//        String username = request.getUsername();
//        User user = (User) userService.loadUserByUsername(username);
        log.info("User: {}", user);
        String token = jwtService.generateToken(user);
        return new AuthenticationResponse(token);
    }
}