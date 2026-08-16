package com.example.PennyWise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CategoryExpenseDTO {

    private String category;

    private BigDecimal amount;
}