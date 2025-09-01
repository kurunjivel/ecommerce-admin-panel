package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.Setter;

@Entity
@Data
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public Long productId;
    public int quantity;
    public double priceAtPurchase;

    // Many items belong to one order
    @ManyToOne
    @JoinColumn(name = "order_id")
    public Order order;

    public OrderItem() {

    }
}
