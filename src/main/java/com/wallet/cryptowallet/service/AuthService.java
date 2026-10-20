package com.wallet.cryptowallet.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.wallet.cryptowallet.dto.AuthRequest;
import com.wallet.cryptowallet.entity.User;
import com.wallet.cryptowallet.entity.Wallet;
import com.wallet.cryptowallet.repository.UserRepository;
import com.wallet.cryptowallet.repository.WalletRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthService(
            UserRepository userRepository,
            WalletRepository walletRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================

    public String register(AuthRequest request) {

        if (request.getUsername() == null ||
                request.getUsername().isBlank()) {

            return "Username is required";
        }

        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            return "Password is required";
        }

        if (userRepository.existsByUsername(
                request.getUsername())) {

            return "Username already exists";
        }

        User user = new User();

        user.setUsername(request.getUsername());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        userRepository.save(user);

        // Automatically create wallet
        Wallet wallet = new Wallet(
                user,
                new BigDecimal("1000.0000")
        );

        walletRepository.save(wallet);

        return "Registration successful";
    }

    // =========================
    // LOGIN
    // =========================

    public Map<String, Object> login(AuthRequest request) {

    Map<String, Object> response = new HashMap<>();

    User user = userRepository
            .findByUsername(request.getUsername())
            .orElse(null);

    if (user == null) {
        response.put("success", false);
        response.put("message", "Invalid username or password");
        return response;
    }

    if (!passwordEncoder.matches(
            request.getPassword(),
            user.getPassword())) {

        response.put("success", false);
        response.put("message", "Invalid username or password");
        return response;
    }

    String token =
            jwtService.generateToken(user.getUsername());

    response.put("success", true);
    response.put("message", "Login successful");
    response.put("token", token);
    response.put("username", user.getUsername());

    return response;
}
}