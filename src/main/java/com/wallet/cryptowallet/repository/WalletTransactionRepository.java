package com.wallet.cryptowallet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wallet.cryptowallet.entity.WalletTransaction;

public interface WalletTransactionRepository
        extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction>
    findBySenderUsernameOrReceiverUsername(
            String senderUsername,
            String receiverUsername
    );
}