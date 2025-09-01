package com.examly.springapp.service;

import com.examly.springapp.dto.OrderCreateRequest;
import com.examly.springapp.dto.OrderItemCreateRequest;
import com.examly.springapp.model.Order;
import com.examly.springapp.model.OrderItem;
import com.examly.springapp.model.Product;
import com.examly.springapp.repository.OrderRepository;
import com.examly.springapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public Order createOrderFromRequest(OrderCreateRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setShippingAddress(request.getShippingAddress());
        order.setOrderDate(LocalDate.now());
        order.setStatus("PENDING");

        double total = 0.0;

        for (OrderItemCreateRequest itemReq : request.getOrderItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock");
            }

            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtPurchase(product.getPrice());
            item.setOrder(order);

            order.getOrderItems().add(item);
            total += product.getPrice() * itemReq.getQuantity();
        }

        order.setTotalAmount(total);

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }
public Order updateOrderStatus(Long id, String status) {
Order order = orderRepository.findById(id)
.orElseThrow(() -> new IllegalArgumentException("Order not found"));

if (!(status.equals("PENDING") || status.equals("SHIPPED")
|| status.equals("DELIVERED") || status.equals("CANCELLED"))) {
throw new IllegalArgumentException("Invalid status");
}

order.setStatus(status);
return orderRepository.save(order);
}
}