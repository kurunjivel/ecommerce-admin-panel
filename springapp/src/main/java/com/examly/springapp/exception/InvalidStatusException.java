package com.examly.springapp.exception;

public class InvalidStatusException extends RuntimeException {
    public InvalidStatusException() {
        super("Invalid order status provided");
    }
    public InvalidStatusException(String message) {
        super(message);
    }
}