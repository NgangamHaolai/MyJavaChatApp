package com.example.mychatappv4.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "messages")
public class MessageEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender")
    private String sender;

    @Column(name = "receiver")
    private String receiver;

    @Column(name = "message")
    private String message;

    @Column(name = "timestamp")
    private Instant timestamp;
}
