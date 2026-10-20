package com.wallet.cryptowallet.controller;

import com.wallet.cryptowallet.dto.AuthRequest;
import com.wallet.cryptowallet.service.AuthService;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public Map<String, Object> register(
            @RequestBody AuthRequest request) {

        String message = authService.register(request);

        Map<String, Object> response = new HashMap<>();

        response.put("message", message);

        return response;
    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody AuthRequest request) {

        return authService.login(request);
    }
}