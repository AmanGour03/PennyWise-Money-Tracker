package com.example.PennyWise.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Email
    @Column(unique = true)
    private String email;
    @Column(unique = true)
    @NotBlank(message = "Username is required")
    private String username;
    @Column(nullable = false)
    @Size(min=6,message = "Password must be at least 6 characters long")
    private String password;

    private String role = "ROLE_USER";

}
