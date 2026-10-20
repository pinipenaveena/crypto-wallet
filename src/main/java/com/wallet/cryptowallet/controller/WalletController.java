package com.wallet.cryptowallet.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wallet.cryptowallet.dto.TransferRequest;
import com.wallet.cryptowallet.entity.User;
import com.wallet.cryptowallet.entity.Wallet;
import com.wallet.cryptowallet.entity.WalletTransaction;
import com.wallet.cryptowallet.repository.UserRepository;
import com.wallet.cryptowallet.repository.WalletRepository;
import com.wallet.cryptowallet.repository.WalletTransactionRepository;
import com.wallet.cryptowallet.service.WalletService;

@RestController
@RequestMapping("/wallet")
public class WalletController {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final WalletService walletService;

    public WalletController(
            UserRepository userRepository,
            WalletRepository walletRepository,
            WalletTransactionRepository transactionRepository,
            WalletService walletService) {

        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.walletService = walletService;
    }

    // ============================
    // MY WALLET
    // ============================

    @GetMapping("/me")
    public Map<String, Object> getMyWallet(
            Authentication authentication) {

        String username =
                authentication.getName();

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        Wallet wallet = walletRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Wallet not found"
                        ));

        Map<String, Object> response =
                new HashMap<>();

        response.put("username", username);
        response.put("balance", wallet.getBalance());

        return response;
    }


    // ============================
    // SEND MONEY
    // ============================

    @PostMapping("/send")
    public Map<String, Object> sendMoney(
            Authentication authentication,
            @RequestBody TransferRequest request) {

        String senderUsername =
                authentication.getName();

        String message =
                walletService.transfer(
                        senderUsername,
                        request
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put("message", message);

        return response;
    }


    // ============================
    // TRANSACTIONS
    // ============================

    @GetMapping("/transactions")
    public List<WalletTransaction> transactions(
            Authentication authentication) {

        String username =
                authentication.getName();

        return transactionRepository
                .findBySenderUsernameOrReceiverUsername(
                        username,
                        username
                );
    }
}