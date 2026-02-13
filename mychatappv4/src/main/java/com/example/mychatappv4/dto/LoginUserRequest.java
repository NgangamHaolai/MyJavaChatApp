package com.example.mychatappv4.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginUserRequest
{
    @NotBlank(message = "username cannot be blank")
    String username;
//    @Email(message = "invalid email id format")
//    @NotBlank(message = "email cannot be blank")
//    String email;
    @NotBlank(message = "password cannot be blank")
    String password;
}
