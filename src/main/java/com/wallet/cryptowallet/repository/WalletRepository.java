package com.wallet.cryptowallet.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wallet.cryptowallet.entity.User;
import com.wallet.cryptowallet.entity.Wallet;

public interface WalletRepository
        extends JpaRepository<Wallet, Long> {

    Optional<Wallet> findByUser(User user);

    Optional<Wallet> findByUserUsername(String username);
}