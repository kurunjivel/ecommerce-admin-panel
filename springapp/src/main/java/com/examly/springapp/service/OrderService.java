package com.examly.springapp.service;

import com.examly.springapp.model.Order;
import com.examly.springapp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getOrderDetails() {
        return orderRepository.findAll();
    }


    public Order getOrderById(Long id) {
        return orderRepository.getOrderById(id);
    }

    public Order addOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }
}
