package com.example.PennyWise.controller;

import com.example.PennyWise.dto.TransactionDTO;
import com.example.PennyWise.model.Transaction;
import com.example.PennyWise.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;


    // GET ALL
    @GetMapping
    public ResponseEntity<Page<TransactionDTO>> getAllTransactions(
            Principal principal,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size,

            @RequestParam(defaultValue = "date")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String direction,

            @RequestParam(required = false)
            String type
    ) {

        Page<TransactionDTO> transactions =
                transactionService.getAllTransactionByUser(
                        principal,
                        page,
                        size,
                        sortBy,
                        direction,
                        type
                );

        return ResponseEntity.ok(transactions);
    }


    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(
            @PathVariable Integer id,
            Principal principal
    ) {

        return ResponseEntity.ok(
                transactionService.getTransactionById(
                        id,
                        principal
                )
        );
    }


    @PostMapping
    public ResponseEntity<TransactionDTO> addTransaction(
            @Valid @RequestBody Transaction transaction,
            Principal principal
    ) {

        TransactionDTO result =
                transactionService.addTransaction(
                        transaction,
                        principal
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @PathVariable Integer id,
            @Valid @RequestBody TransactionDTO dto,
            Principal principal
    ) {

        return ResponseEntity.ok(
                transactionService.updateTransaction(
                        id,
                        dto,
                        principal
                )
        );
    }
}