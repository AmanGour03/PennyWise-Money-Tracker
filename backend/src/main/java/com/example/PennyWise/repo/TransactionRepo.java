package com.example.PennyWise.repo;

import com.example.PennyWise.model.Transaction;
import com.example.PennyWise.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepo extends JpaRepository<Transaction,Integer> {
    Page<Transaction> findByUser(User user, Pageable pageable);
    Page<Transaction> findByUserAndType(User user, String type, Pageable pageable);
}
