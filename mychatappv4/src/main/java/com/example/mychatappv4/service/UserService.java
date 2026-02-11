package com.example.mychatappv4.service;

import com.example.mychatappv4.model.User;
import com.example.mychatappv4.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService  // inbuilt Interface provided by Spring Security
{
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User addUser(User user)  // inbuilt JPA method
    {
        userRepository.save(user);
        return user;
    }

    public List<User> getUsers()    // inbuilt JPA method
    {
        List<User> users = userRepository.findAll();
        return users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        return userRepository.findByUsername(username); // called from UserRepository Interface
    }
}
