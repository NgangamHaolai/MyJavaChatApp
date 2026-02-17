package com.example.mychatappv4.service;

import com.example.mychatappv4.dto.AuthenticationResponse;
import com.example.mychatappv4.dto.LoginUserRequest;
import com.example.mychatappv4.dto.RegisterUserRequest;
import org.springframework.stereotype.Service;

@Service
public interface AuthenticationService
{
    AuthenticationResponse register(RegisterUserRequest request);
    AuthenticationResponse authenticate(LoginUserRequest request);
}
