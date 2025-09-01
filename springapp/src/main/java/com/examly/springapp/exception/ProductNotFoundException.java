package com.examly.springapp.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(){
        super("Product not found");
    }
}

