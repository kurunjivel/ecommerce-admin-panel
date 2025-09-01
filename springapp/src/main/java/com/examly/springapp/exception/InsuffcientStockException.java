package com.examly.springapp.exception;

public class InsuffcientStockException extends RuntimeException{

    public InsuffcientStockException() {
        super("Insufficient stock");
    }
    
}