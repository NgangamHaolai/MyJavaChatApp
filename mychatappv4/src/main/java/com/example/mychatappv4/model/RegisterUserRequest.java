package com.example.mychatappv4.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class RegisterUserRequest
{
    @Length(min = 3, max = 15, message = "name should be min-3 chars and max-15 char")
    @NotBlank(message = "name cannot be empty")
    private String name;

    @Length(min = 3, max = 15, message = "username should be min-3 chars and max-15 char")
    @NotBlank(message = "username cannot be empty")
    private String username;

    @Email(message = "invalid email id format")
    @NotBlank(message = "Email cannot be empty")
    private String email;

    @Length(min = 6, max = 15, message = "password must be min-6 and max-15 char")
    @NotBlank(message = "password cannot be blank")
    private String password;

    @Length(min = 3, max = 15, message = "password must be min-6 and max-15 char")
    @NotBlank(message = "confirm password cannot be blank")
    private String confirmPassword;
}
