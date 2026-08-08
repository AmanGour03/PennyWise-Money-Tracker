package com.example.PennyWise.controller;

import com.example.PennyWise.dto.TransactionDTO;
import com.example.PennyWise.model.Transaction;
import com.example.PennyWise.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService service;

    @PostMapping
    public ResponseEntity<Transaction>addTransaction(@Valid @RequestBody Transaction transaction, Principal principal){
        return ResponseEntity.ok(service.addTransaction(transaction,principal));
    }

    @GetMapping
    public ResponseEntity<Page<TransactionDTO>>getAllTransactionByUser(
            Principal principal,
            @RequestParam(defaultValue = "0")int page,
            @RequestParam(defaultValue = "5")int size,
            @RequestParam(defaultValue = "date")String sortBy,
            @RequestParam(required = false)String type
            ){
        return ResponseEntity.ok(service.getAllTransactionByUser(principal,page,size,sortBy,type));
    }

}
