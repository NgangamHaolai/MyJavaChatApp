package com.example.mychatappv4.dto;

public class AuthenticationResponse
{
    private String token;

    public AuthenticationResponse(String token)
    {
        this.token = token;
    }

    public String getToken()
    {
        return token;
    }
}
