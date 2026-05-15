package com.examly.springapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String shippingAddress;
    private double totalAmount;
    private String status;
    private LocalDate orderDate;
    private List<OrderItemDTO> orderItems;
}
