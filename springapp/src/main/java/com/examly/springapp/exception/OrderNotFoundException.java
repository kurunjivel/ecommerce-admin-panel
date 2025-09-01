package com.examly.springapp.exception;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(){
        super("Order not found");
    }
}
