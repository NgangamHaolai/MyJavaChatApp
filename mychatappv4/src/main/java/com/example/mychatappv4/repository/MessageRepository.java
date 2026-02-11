package com.example.mychatappv4.repository;

import com.example.mychatappv4.model.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Long>
{
    @Query(" SELECT u FROM MessageEntity u WHERE " +
            " (u.sender= :sender AND u.receiver= :receiver) OR " +
            " (u.sender= :receiver AND u.receiver= :sender) "
    )
    List<MessageEntity> findMessages(@Param("sender") String sender, @Param("receiver") String receiver);
}
