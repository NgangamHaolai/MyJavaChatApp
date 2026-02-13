package com.example.mychatappv4.errors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler
{   // when validation fails Spring throws MethodArgumentNotValidException but the result is not clean so we return it properly in JSON format by doing this.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> methodArgumentNotValidException(MethodArgumentNotValidException exception)
    {
        Map<String, String> errors = new HashMap<>();
        List<FieldError> fieldErrorList = exception.getFieldErrors();
        for(FieldError fieldError : fieldErrorList)
        {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

//    @ExceptionHandler(IllegalArgumentException.class)
//    public ResponseEntity<Map<String,String>> illegalArgumentException(IllegalArgumentException exception)
//    {
//        exception.printStackTrace(); // not recommended in production code instead use logger
//        log.warn(exception.getMessage());   // recommended!
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", exception.getMessage())); // JARVIS recommends
//    }

    @ExceptionHandler(UsernameNotFoundException.class)  // when username does not exist when logging in
    public ResponseEntity<Map<String, String>> usernameNotFoundException(UsernameNotFoundException exception)
    {
        log.warn("Authentication Failed: {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid username or password"));
    }
    @ExceptionHandler(BadCredentialsException.class)    // when password incorrect when logging in
    public ResponseEntity<Map<String, String>> badCredentialsException(BadCredentialsException exception)
    {
        log.warn("Authentication Failed: {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid username or password"));
    }
}
