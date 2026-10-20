package com.wallet.cryptowallet.dto;

import java.math.BigDecimal;

public class TransferRequest {

    private String receiverUsername;

    private BigDecimal amount;

    public TransferRequest() {
    }

    public String getReceiverUsername() {
        return receiverUsername;
    }

    public void setReceiverUsername(String receiverUsername) {
        this.receiverUsername = receiverUsername;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}