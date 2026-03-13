package com.example.mychatappv4.controller;

import com.example.mychatappv4.dto.AvatarRequest;
import com.example.mychatappv4.dto.AvatarResponse;
import com.example.mychatappv4.dto.UserResponse;
import com.example.mychatappv4.model.MessageEntity;
import com.example.mychatappv4.repository.MessageRepository;
import com.example.mychatappv4.repository.UserRepository;
import com.example.mychatappv4.service.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@Slf4j
public class ChatController
{
    private final MessageRepository messageRepository;
//    private final UserRepository userRepository;
    private final UserServiceImpl userService;
    private final SimpMessagingTemplate simpMessagingTemplate; // Power Tool // It allows you to send messages programmatically.

//    @Value("${app.size}")   // checking the usage of @Value annotation
//    private String sized;
//    @Value("${app.description}")
//    private String description;
//    @Autowired
//    private Environment env;    // checking the usage of Environment object

    @Autowired
    public ChatController(MessageRepository messageRepository, UserRepository userRepository, UserServiceImpl userService, SimpMessagingTemplate simpMessagingTemplate) {
        this.messageRepository = messageRepository;
//        this.userRepository = userRepository;
        this.userService = userService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/chat")
    public void sendMessage(MessageEntity message)
    {
        log.info("I am inside send Message [MessageObject] {}", message);
//        message.setTimestamp(LocalDateTime.now());    // discarded because it does not provide a TimeZone.
        message.setTimestamp(Instant.now());    // whereas this... gives TimeZone.
        messageRepository.save(message);

        log.info("I am inside send Message [MessageObject] {}", message);
//        log.error("something went wrong!");

        // send message to both sender and receiver
        simpMessagingTemplate.convertAndSend("/topic/messages/" +message.getReceiver(), message);
        simpMessagingTemplate.convertAndSend("/topic/messages/" +message.getSender(), message);
    }

    @GetMapping("/api/messages")
    public List<MessageEntity> getMessages(@RequestParam String sender, @RequestParam String receiver)
    {
//        System.out.println("size"+sized);
//        System.out.println("desc: "+description);
//        System.out.println(env.getProperty("spring.datasource.url"));
        log.info("sender {}", sender);
        log.info("receiver {}", receiver);
        return messageRepository.findMessages(sender, receiver);
    }
    @GetMapping("/api/users")
    public List<UserResponse> getUsers()
    {
//        log.error("an error occurred");
        return userService.getUsers();
    }
    @PutMapping("/api/avatar")
    public ResponseEntity<AvatarResponse> setAvatar(@RequestBody AvatarRequest request)
    {
        log.info("avatar: {}", request);
        AvatarResponse response = userService.updateUserAvatar(request);
        log.info("response: {}", response);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
