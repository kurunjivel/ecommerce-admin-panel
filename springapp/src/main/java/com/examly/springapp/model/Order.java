package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long id;
    public String customerName;
    public String customerEmail;
    public String shippingAddress;
    public double totalAmount;
    public String status;
    public LocalDate orderDate;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    public List<OrderItem> orderItems;

    public Order() {

    }
}
