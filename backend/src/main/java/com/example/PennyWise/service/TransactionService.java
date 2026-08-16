package com.example.PennyWise.service;

import org.springframework.security.access.AccessDeniedException;
import java.security.Principal;
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


@Service
public class TransactionService {

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private UserRepo userRepo;

    private User getCurrentUser(Principal principal) {

        return userRepo.findByUsername(principal.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    public TransactionDTO mapToDTO(Transaction transaction) {

        TransactionDTO dto = new TransactionDTO();

        dto.setId(transaction.getId());
        dto.setTitle(transaction.getTitle());
        dto.setCategory(transaction.getCategory());
        dto.setDescription(transaction.getDescription());

        if (transaction.getType() != null) {
            dto.setType(transaction.getType());
        }

        dto.setAmount(transaction.getAmount());
        dto.setDate(transaction.getDate());

        return dto;
    }

    public Page<TransactionDTO> getAllTransactionByUser(
            Principal principal,
            int page,
            int size,
            String sortBy,
            String direction,
            String type
    ) {

        User user = userRepo
                .findByUsername(principal.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // Validate page and size

        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page cannot be negative"
            );
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException(
                    "Size must be between 1 and 100"
            );
        }


        // Validate sorting direction

        Sort.Direction sortDirection;

        try {

            sortDirection =
                    Sort.Direction.fromString(
                            direction
                    );

        } catch (IllegalArgumentException e) {

            throw new IllegalArgumentException(
                    "Invalid sort direction. Use asc or desc."
            );
        }


        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                sortDirection,
                                sortBy
                        )
                );


        Page<Transaction> transactions;


        // =========================================================
        // FILTER BY TYPE
        // =========================================================

        if (type != null && !type.isBlank()) {

            TransactionType transactionType;

            try {

                transactionType =
                        TransactionType.valueOf(
                                type.toUpperCase()
                        );

            } catch (IllegalArgumentException e) {

                throw new IllegalArgumentException(
                        "Invalid transaction type. " +
                                "Use INCOME or EXPENSE."
                );
            }


            transactions =
                    transactionRepo.findByUserAndType(
                            user,
                            transactionType,
                            pageable
                    );

        } else {

            transactions =
                    transactionRepo.findByUser(
                            user,
                            pageable
                    );
        }


        // Convert Entity → DTO

        return transactions.map(
                this::mapToDTO
        );
    }

    public TransactionDTO getTransactionById(
            Integer id,
            Principal principal
    ) {

        User user = getCurrentUser(principal);

        Transaction transaction =
                transactionRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Transaction not found"
                                )
                        );

        if (!transaction.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not authorized to access this transaction"
            );
        }

        return mapToDTO(transaction);
    }

    public TransactionDTO addTransaction(
            Transaction transaction,
            Principal principal
    ) {

        User user = getCurrentUser(principal);

        // Never accept the user from the frontend.
        // Set the authenticated user from Principal.

        transaction.setUser(user);

        Transaction savedTransaction =
                transactionRepo.save(transaction);

        return mapToDTO(savedTransaction);
    }

    public TransactionDTO updateTransaction(
            Integer id,
            TransactionDTO dto,
            Principal principal
    ) {

        User user = userRepo
                .findByUsername(principal.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        Transaction transaction =
                transactionRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Transaction not found"
                                )
                        );

        if (!transaction.getUser()
                .getId()
                .equals(user.getId())) {

            throw new AccessDeniedException(
                    "You are not allowed to modify this transaction"
            );
        }

        transaction.setTitle(dto.getTitle());
        transaction.setCategory(dto.getCategory());
        transaction.setDescription(dto.getDescription());
        transaction.setType(dto.getType());
        transaction.setAmount(dto.getAmount());
        transaction.setDate(dto.getDate());

        Transaction updated =
                transactionRepo.save(transaction);

        return mapToDTO(updated);
    }
}