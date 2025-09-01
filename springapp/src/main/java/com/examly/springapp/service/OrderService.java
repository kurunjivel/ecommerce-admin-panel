package com.examly.springapp.service;

import com.examly.springapp.model.Order;
import com.examly.springapp.model.OrderItem;
import com.examly.springapp.model.Product;
import com.examly.springapp.repository.OrderRepository;
import com.examly.springapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

//    public Order createOrder(Order order) {
//        double total = 0.0;
//
//        for (OrderItem item : order.getOrderitems()) {
//            Product product = productRepository.findById(item.getProductId())
//                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
//            item.setPriceAtPurchase(product.getPrice());
//            total += product.getPrice() * item.getQuantity();
//        }
//
//        order.setTotalAmount(total);
//        order.setStatus("PENDING");
//        order.setOrderDate(LocalDate.now());
//
//        return orderRepository.save(order);
//    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

//    public Order updateOrderStatus(Long id, String status) {
//        Order order = orderRepository.findById(id).orElse(null);
//        if (order != null) {
//            order.setStatus(status);
//            return orderRepository.save(order);
//        }
//        return null;
//    }
}
