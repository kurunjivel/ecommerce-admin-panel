package com.examly.springapp.service;

import com.examly.springapp.dto.OrderDTO;
import com.examly.springapp.dto.OrderItemDTO;
import com.examly.springapp.dto.OrderCreateRequest;
import com.examly.springapp.dto.OrderItemCreateRequest;
import com.examly.springapp.exception.InsuffcientStockException;
import com.examly.springapp.exception.InvalidStatusException;
import com.examly.springapp.exception.OrderNotFoundException;
import com.examly.springapp.exception.ProductNotFoundException;
import com.examly.springapp.model.Order;
import com.examly.springapp.model.OrderItem;
import com.examly.springapp.model.Product;
import com.examly.springapp.repository.OrderRepository;
import com.examly.springapp.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private static final Set<String> VALID_STATUSES = Set.of("PENDING", "SHIPPED", "DELIVERED", "CANCELLED");

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // ── CREATE ───────────────────────────────────────────────────────────────

    @Transactional
    public OrderDTO createOrderFromRequest(OrderCreateRequest request) {
        log.info("Creating order for customer: {}", request.getCustomerName());

        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setShippingAddress(request.getShippingAddress());
        order.setOrderDate(LocalDate.now());
        order.setStatus("PENDING");

        double total = 0.0;

        for (OrderItemCreateRequest itemReq : request.getOrderItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> {
                        log.warn("Product not found id={}", itemReq.getProductId());
                        return new ProductNotFoundException();
                    });

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                log.warn("Insufficient stock for product id={}", product.getId());
                throw new InsuffcientStockException();
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
        Order saved = orderRepository.save(order);
        log.info("Order created id={}", saved.getId());
        return toDTO(saved);
    }

    // ── READ (list) ─────────────────────────────────────────────────────────

    public List<OrderDTO> getAllOrders() {
        log.info("Fetching all orders");
        return orderRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── READ (single) ────────────────────────────────────────────────────────

    public OrderDTO getOrderById(Long id) {
        log.info("Fetching order id={}", id);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Order not found id={}", id);
                    return new OrderNotFoundException();
                });
        return toDTO(order);
    }

    // ── UPDATE STATUS ─────────────────────────────────────────────────────

    @Transactional
    public OrderDTO updateOrderStatus(Long id, String status) {
        log.info("Updating order id={} to status={}", id, status);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException());

        if (!VALID_STATUSES.contains(status)) {
            log.warn("Invalid status: {}", status);
            throw new InvalidStatusException();
        }

        // Cannot revert a DELIVERED order to CANCELLED — must go through proper logic
        if ("CANCELLED".equals(status)) {
            return cancelOrder(id);
        }

        order.setStatus(status);
        Order saved = orderRepository.save(order);
        log.info("Order status updated id={} status={}", saved.getId(), saved.getStatus());
        return toDTO(saved);
    }

    // ── CANCEL ORDER (with stock rollback) ────────────────────────────────

    @Transactional
    public OrderDTO cancelOrder(Long id) {
        log.info("Cancelling order id={}", id);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException());

        if ("DELIVERED".equals(order.getStatus())) {
            log.warn("Cannot cancel DELIVERED order id={}", id);
            throw new InvalidStatusException("Cannot cancel a DELIVERED order");
        }

        if ("CANCELLED".equals(order.getStatus())) {
            log.warn("Order already cancelled id={}", id);
            throw new InvalidStatusException("Order is already cancelled");
        }

        // Rollback stock for each item
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
            log.info("Stock rolled back for product id={} by qty={}", product.getId(), item.getQuantity());
        }

        order.setStatus("CANCELLED");
        Order saved = orderRepository.save(order);
        log.info("Order cancelled id={}", saved.getId());
        return toDTO(saved);
    }

    // ── MAPPING ──────────────────────────────────────────────────────────────

    public OrderDTO toDTO(Order o) {
        List<OrderItemDTO> items = o.getOrderItems().stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .priceAtPurchase(item.getPriceAtPurchase())
                        .build())
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(o.getId())
                .customerName(o.getCustomerName())
                .customerEmail(o.getCustomerEmail())
                .shippingAddress(o.getShippingAddress())
                .totalAmount(o.getTotalAmount())
                .status(o.getStatus())
                .orderDate(o.getOrderDate())
                .orderItems(items)
                .build();
    }
}