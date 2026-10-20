package com.wallet.cryptowallet.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wallet.cryptowallet.dto.TransferRequest;
import com.wallet.cryptowallet.entity.User;
import com.wallet.cryptowallet.entity.Wallet;
import com.wallet.cryptowallet.entity.WalletTransaction;
import com.wallet.cryptowallet.repository.UserRepository;
import com.wallet.cryptowallet.repository.WalletRepository;
import com.wallet.cryptowallet.repository.WalletTransactionRepository;

@Service
public class WalletService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    public WalletService(
            UserRepository userRepository,
            WalletRepository walletRepository,
            WalletTransactionRepository transactionRepository) {

        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public String transfer(
            String senderUsername,
            TransferRequest request) {

        // Check receiver
        if (request.getReceiverUsername() == null ||
                request.getReceiverUsername().isBlank()) {

            return "Receiver username is required";
        }

        // Check amount
        if (request.getAmount() == null ||
                request.getAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            return "Amount must be greater than zero";
        }

        // Prevent sending to yourself
        if (senderUsername.equals(
                request.getReceiverUsername())) {

            return "You cannot send money to yourself";
        }

        // Find sender
        User sender = userRepository
                .findByUsername(senderUsername)
                .orElse(null);

        if (sender == null) {
            return "Sender not found";
        }

        // Find receiver
        User receiver = userRepository
                .findByUsername(
                        request.getReceiverUsername()
                )
                .orElse(null);

        if (receiver == null) {
            return "Receiver not found";
        }

        // Find sender wallet
        Wallet senderWallet = walletRepository
                .findByUser(sender)
                .orElse(null);

        if (senderWallet == null) {
            return "Sender wallet not found";
        }

        // Find receiver wallet
        Wallet receiverWallet = walletRepository
                .findByUser(receiver)
                .orElse(null);

        if (receiverWallet == null) {
            return "Receiver wallet not found";
        }

        // Check balance
        if (senderWallet.getBalance()
                .compareTo(request.getAmount()) < 0) {

            return "Insufficient balance";
        }

        // Deduct money from sender
        senderWallet.setBalance(
                senderWallet.getBalance()
                        .subtract(request.getAmount())
        );

        // Add money to receiver
        receiverWallet.setBalance(
                receiverWallet.getBalance()
                        .add(request.getAmount())
        );

        // Save both wallets
        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        // Save transaction
        WalletTransaction transaction =
                new WalletTransaction(
                        senderUsername,
                        request.getReceiverUsername(),
                        request.getAmount()
                );

        transactionRepository.save(transaction);

        return "Transfer successful";
    }
}