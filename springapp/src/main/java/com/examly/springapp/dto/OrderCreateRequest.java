package com.examly.springapp.dto;

import java.util.List;

public class OrderCreateRequest {
    private String customerName;
    private String customerEmail;
    private String shippingAddress;
    private List<OrderItemCreateRequest> orderItems;

    // getters and setters
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public List<OrderItemCreateRequest> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemCreateRequest> orderItems) { this.orderItems = orderItems; }
}
