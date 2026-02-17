package com.example.mychatappv4.service;

import com.example.mychatappv4.dto.AvatarRequest;
import com.example.mychatappv4.dto.AvatarResponse;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public interface UserService extends UserDetailsService
{
    AvatarResponse updateUserAvatar(AvatarRequest message);
}
