package com.examly.springapp.controller;

import com.examly.springapp.dto.OrderCreateRequest;
import com.examly.springapp.dto.OrderDTO;
import com.examly.springapp.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order management APIs")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    // ── CREATE ────────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new order")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderCreateRequest request) {
        log.info("POST /api/orders");
        OrderDTO created = orderService.createOrderFromRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── READ (list) ───────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "Get all orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        log.info("GET /api/orders");
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ── READ (single) ─────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        log.info("GET /api/orders/{}", id);
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // ── UPDATE STATUS ──────────────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id,
                                                      @RequestBody Map<String, String> request) {
        log.info("PATCH /api/orders/{}/status", id);
        String status = request.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // ── CANCEL ────────────────────────────────────────────────────────────

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order and restore stock")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long id) {
        log.info("PATCH /api/orders/{}/cancel", id);
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }
}
