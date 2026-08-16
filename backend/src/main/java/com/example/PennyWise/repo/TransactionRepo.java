package com.example.PennyWise.repo;

import com.example.PennyWise.model.Transaction;
import com.example.PennyWise.model.TransactionType;
import com.example.PennyWise.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepo
        extends JpaRepository<Transaction, Integer>,
        JpaSpecificationExecutor<Transaction> {

    // For pagination

    Page<Transaction> findByUser(
            User user,
            Pageable pageable
    );

    // For analytics

    List<Transaction> findAllByUser(
            User user
    );

    // For filtering by type

    Page<Transaction> findByUserAndType(
            User user,
            TransactionType type,
            Pageable pageable
    );

    // Category

    Page<Transaction> findByUserAndCategoryIgnoreCase(
            User user,
            String category,
            Pageable pageable
    );

    // Type + Category

    Page<Transaction> findByUserAndTypeAndCategoryIgnoreCase(
            User user,
            TransactionType type,
            String category,
            Pageable pageable
    );

    // Date range

    Page<Transaction> findByUserAndDateBetween(
            User user,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    // Type + Date range

    Page<Transaction> findByUserAndTypeAndDateBetween(
            User user,
            TransactionType type,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    // Category + Date range

    Page<Transaction>
    findByUserAndCategoryIgnoreCaseAndDateBetween(
            User user,
            String category,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    // Type + Category + Date
    Page<Transaction>
    findByUserAndTypeAndCategoryIgnoreCaseAndDateBetween(
            User user,
            TransactionType type,
            String category,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    // TOTAL INCOME / EXPENSE

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user = :user
        AND t.type = :type
    """)
    BigDecimal getTotalByType(
            @Param("user") User user,
            @Param("type") TransactionType type
    );

    // CATEGORY EXPENSES

    @Query("""
        SELECT t.category, SUM(t.amount)
        FROM Transaction t
        WHERE t.user = :user
        AND t.type = :type
        GROUP BY t.category
        ORDER BY SUM(t.amount) DESC
    """)
    List<Object[]> getAmountByCategory(
            @Param("user") User user,
            @Param("type") TransactionType type
    );

    // DATE RANGE TOTAL

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user = :user
        AND t.type = :type
        AND t.date BETWEEN :startDate AND :endDate
    """)
    BigDecimal getTotalByTypeAndDate(
            @Param("user") User user,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}