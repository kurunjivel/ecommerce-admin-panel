package com.examly.springapp.controller;

import com.examly.springapp.model.Order;
import com.examly.springapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Order getOrderDetailById(@PathVariable("id") Long id) {
        return orderService.getOrderById(id);
    }

//    @PostMapping
//    public Order createOrder(@RequestBody Order order) {
//        return orderService.createOrder(order);
//    }

//    @PatchMapping("/{id}/status")
//    public Order updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
//        return orderService.updateOrderStatus(id, request.get("status"));
//    }
}
