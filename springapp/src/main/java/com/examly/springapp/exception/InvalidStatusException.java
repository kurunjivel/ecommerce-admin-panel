package com.examly.springapp.exception;

public class InvalidStatusException extends RuntimeException{

    public InvalidStatusException() {
        super("Invalid status");
    }
}