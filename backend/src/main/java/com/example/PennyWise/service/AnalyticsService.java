package com.example.PennyWise.service;

import com.example.PennyWise.dto.AnalyticsSummaryDTO;
import com.example.PennyWise.dto.CategoryExpenseDTO;
import com.example.PennyWise.dto.MonthlyAnalyticsDTO;
import com.example.PennyWise.model.Transaction;
import com.example.PennyWise.model.TransactionType;
import com.example.PennyWise.model.User;
import com.example.PennyWise.repo.TransactionRepo;
import com.example.PennyWise.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.Principal;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TransactionRepo transactionRepo;
    private final UserRepo userRepo;


    // =========================================================
    // GET CURRENT USER
    // =========================================================

    private User getCurrentUser(Principal principal) {

        return userRepo
                .findByUsername(principal.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }


    // =========================================================
    // SUMMARY
    // =========================================================

    public AnalyticsSummaryDTO getSummary(
            Principal principal
    ) {

        User user = getCurrentUser(principal);

        BigDecimal totalIncome =
                transactionRepo.getTotalByType(
                        user,
                        TransactionType.INCOME
                );

        BigDecimal totalExpense =
                transactionRepo.getTotalByType(
                        user,
                        TransactionType.EXPENSE
                );


        if (totalIncome == null) {
            totalIncome = BigDecimal.ZERO;
        }

        if (totalExpense == null) {
            totalExpense = BigDecimal.ZERO;
        }


        BigDecimal balance =
                totalIncome.subtract(totalExpense);


        BigDecimal savingsRate =
                BigDecimal.ZERO;


        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {

            savingsRate =
                    balance
                            .divide(
                                    totalIncome,
                                    4,
                                    RoundingMode.HALF_UP
                            )
                            .multiply(
                                    BigDecimal.valueOf(100)
                            )
                            .setScale(
                                    2,
                                    RoundingMode.HALF_UP
                            );
        }


        return new AnalyticsSummaryDTO(
                totalIncome,
                totalExpense,
                balance,
                savingsRate
        );
    }


    // =========================================================
    // EXPENSES BY CATEGORY
    // =========================================================

    public List<CategoryExpenseDTO> getCategoryExpenses(
            Principal principal
    ) {

        User user = getCurrentUser(principal);


        List<Object[]> results =
                transactionRepo.getAmountByCategory(
                        user,
                        TransactionType.EXPENSE
                );


        List<CategoryExpenseDTO> response =
                new ArrayList<>();


        for (Object[] result : results) {

            String category =
                    (String) result[0];

            BigDecimal amount =
                    (BigDecimal) result[1];


            response.add(
                    new CategoryExpenseDTO(
                            category,
                            amount
                    )
            );
        }


        return response;
    }


    // =========================================================
    // MONTHLY ANALYTICS
    // =========================================================

    public List<MonthlyAnalyticsDTO> getMonthlyAnalytics(
            Principal principal,
            int months
    ) {

        User user = getCurrentUser(principal);

        List<Transaction> transactions =
                transactionRepo.findAllByUser(user);

        Map<YearMonth, BigDecimal> income =
                new HashMap<>();

        Map<YearMonth, BigDecimal> expense =
                new HashMap<>();


        for (Transaction transaction : transactions) {

            if (transaction.getDate() == null) {
                continue;
            }


            YearMonth yearMonth =
                    YearMonth.from(
                            transaction.getDate()
                    );


            if (transaction.getAmount() == null) {
                continue;
            }


            if (transaction.getType()
                    == TransactionType.INCOME) {

                income.merge(
                        yearMonth,
                        transaction.getAmount(),
                        BigDecimal::add
                );

            } else if (
                    transaction.getType()
                            == TransactionType.EXPENSE
            ) {

                expense.merge(
                        yearMonth,
                        transaction.getAmount(),
                        BigDecimal::add
                );
            }
        }


        List<MonthlyAnalyticsDTO> result =
                new ArrayList<>();


        YearMonth current =
                YearMonth.now();


        for (
                int i = months - 1;
                i >= 0;
                i--
        ) {

            YearMonth month =
                    current.minusMonths(i);


            BigDecimal monthlyIncome =
                    income.getOrDefault(
                            month,
                            BigDecimal.ZERO
                    );


            BigDecimal monthlyExpense =
                    expense.getOrDefault(
                            month,
                            BigDecimal.ZERO
                    );


            BigDecimal balance =
                    monthlyIncome.subtract(
                            monthlyExpense
                    );


            result.add(
                    new MonthlyAnalyticsDTO(
                            month.toString(),
                            monthlyIncome,
                            monthlyExpense,
                            balance
                    )
            );
        }


        return result;
    }
}