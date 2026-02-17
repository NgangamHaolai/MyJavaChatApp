package com.example.mychatappv4.service;

import com.example.mychatappv4.dto.AvatarRequest;
import com.example.mychatappv4.dto.AvatarResponse;
import com.example.mychatappv4.dto.UserResponse;
import com.example.mychatappv4.model.User;
import com.example.mychatappv4.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class UserServiceImpl implements UserService // inbuilt Interface provided by Spring Security
{
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    public User addUser(User user)  // inbuilt JPA method
    {
        userRepository.save(user);
        return user;
    }

    public List<UserResponse> getUsers()    // inbuilt JPA method
    {
        log.info("inside getUsers()");
        List<User> users = userRepository.findAll();
        log.info("users: {}", users);
        List<UserResponse> usersList = new ArrayList<>();
        for(User user : users)
        {
            usersList.add(objectMapper.convertValue(user, UserResponse.class));
        }
        log.info("usersList: {}", usersList);
        return usersList;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        return userRepository.findByUsername(username); // called from UserRepository Interface
    }

    @Override
    public AvatarResponse updateUserAvatar(AvatarRequest message)
    {
        String avatar = message.getAvatar();
        String loggedInUser = message.getLoggedInUser();
        User user = userRepository.findByUsername(loggedInUser);
        user.setAvatar(avatar);
        userRepository.save(user);
        AvatarResponse response = new AvatarResponse();
        response.setMessage("Avatar set");
        return response;
    }
}
