package com.example.PennyWise.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TransactionDTO {
    private Integer id;
    private String title;
    private String category;
    private String description;
    private String type;
    private double amount;
    private LocalDate date;
}
