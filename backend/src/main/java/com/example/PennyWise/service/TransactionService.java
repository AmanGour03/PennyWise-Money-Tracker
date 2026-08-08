package com.example.PennyWise.service;

import com.example.PennyWise.dto.TransactionDTO;
import com.example.PennyWise.model.Transaction;
import com.example.PennyWise.model.TransactionType;
import com.example.PennyWise.model.User;
import com.example.PennyWise.repo.TransactionRepo;
import com.example.PennyWise.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.security.Principal;
import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepo transactionRepo;
    @Autowired
    private UserRepo userRepo;

    public TransactionDTO mapToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setTitle(transaction.getTitle());
        dto.setCategory(transaction.getCategory());
        dto.setDescription(transaction.getDescription());
        dto.setType(transaction.getType().name());
        dto.setAmount(transaction.getAmount());
        dto.setDate(transaction.getDate());
        return dto;
    }

    public Page<TransactionDTO> getAllTransactionByUser(
            Principal principal,
            int page,
            int size,
            String sortBy,
            String type
    ) {
        User user = userRepo.findByUsername(principal.getName())
                .orElseThrow();
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).descending()
        );
        Page<Transaction> transactions;
        if (type != null && !type.isEmpty()) {
            transactions = transactionRepo.findByUserAndType(
                    user,
                    String.valueOf(TransactionType.valueOf(type.toUpperCase())),
                    pageable
            );
        } else {
            transactions = transactionRepo.findByUser(user, pageable);
        }
        return transactions.map(this::mapToDTO);
    }

    public Transaction addTransaction(Transaction transaction, Principal principal) {
        User user = userRepo.findByUsername(principal.getName()).orElseThrow();
        transaction.setUser(user);
        return transactionRepo.save(transaction);
    }
}
