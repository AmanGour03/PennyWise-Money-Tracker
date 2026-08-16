package com.example.PennyWise.controller;

import com.example.PennyWise.dto.AnalyticsSummaryDTO;
import com.example.PennyWise.dto.CategoryExpenseDTO;
import com.example.PennyWise.dto.MonthlyAnalyticsDTO;
import com.example.PennyWise.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDTO> getSummary(
            Principal principal
    ) {

        return ResponseEntity.ok(
                analyticsService.getSummary(principal)
        );
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryExpenseDTO>> getCategoryExpenses(
            Principal principal
    ) {

        return ResponseEntity.ok(
                analyticsService.getCategoryExpenses(principal)
        );
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyAnalyticsDTO>> getMonthlyAnalytics(
            @RequestParam(defaultValue = "6") int months,
            Principal principal
    ) {

        if (months < 1 || months > 24) {
            throw new IllegalArgumentException(
                    "Months must be between 1 and 24"
            );
        }

        return ResponseEntity.ok(
                analyticsService.getMonthlyAnalytics(
                        principal,
                        months
                )
        );
    }
}