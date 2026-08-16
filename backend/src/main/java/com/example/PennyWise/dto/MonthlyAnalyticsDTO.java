package com.example.PennyWise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MonthlyAnalyticsDTO {

    private String month;

    private BigDecimal income;

    private BigDecimal expense;

    private BigDecimal balance;
}