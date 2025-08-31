package com.examly.springapp.controller;

import com.examly.springapp.model.Order;
import com.examly.springapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/")
    public List<Order> getOrders() {
        return orderService.getOrderDetails();
    }

    @GetMapping("/{id}")
    public  Order getOrderDetailById(@PathVariable("id") Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping("/")
    public Order createOrder(@RequestBody Order order) {
        return orderService.addOrder(order);
    }

    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable("id") Long id, @RequestBody Order order) {
        return orderService.updateOrder(order);
    }

//    @PatchMapping("/{id}/{status}")
//    public getPatch
}
