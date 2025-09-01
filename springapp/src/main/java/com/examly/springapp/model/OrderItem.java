package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public Long productId;
    public int quantity;
    public double priceAtPurchase;
    public Product product;

    // Many items belong to one order
    @ManyToOne
    @JoinColumn(name = "order_id")
    public Order order;
}
