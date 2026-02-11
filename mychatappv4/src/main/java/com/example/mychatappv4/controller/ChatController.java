package com.example.mychatappv4.controller;

import com.example.mychatappv4.model.MessageEntity;
import com.example.mychatappv4.repository.MessageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@Slf4j
public class ChatController
{
    @Autowired
    public MessageRepository messageRepository;
    @Autowired
    public SimpMessagingTemplate simpMessagingTemplate; // Power Tool // It allows you to send messages programmatically.

    @MessageMapping("/chat")
    public void sendMessage(MessageEntity message)
    {
        message.setTimeStamp(LocalDateTime.now());
        messageRepository.save(message);

        log.info("I am inside send Message");
        log.error("something went wrong!");

        // send message to both sender and receiver
        simpMessagingTemplate.convertAndSend("/topic/messages/" +message.getReceiver());
        simpMessagingTemplate.convertAndSend("/topic/messages/" +message.getSender());
    }

    @MessageMapping("/api/messages")
    public List<MessageEntity> getMessages(@RequestParam String sender, @RequestParam String receiver)
    {
        return messageRepository.findMessages(sender, receiver);
    }
}
