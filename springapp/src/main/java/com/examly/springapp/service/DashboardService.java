package com.examly.springapp.service;

import com.examly.springapp.dto.DashboardDTO;
import com.examly.springapp.dto.OrderDTO;
import com.examly.springapp.model.Order;
import com.examly.springapp.model.OrderItem;
import com.examly.springapp.repository.OrderRepository;
import com.examly.springapp.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);
    private static final int LOW_STOCK_THRESHOLD = 5;

    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderService orderService;

    public DashboardDTO getDashboard() {
        log.info("Building dashboard analytics");

        List<Order> orders = orderRepository.findAll();

        long total       = productRepository.count();
        long lowStock    = productRepository.findAll().stream()
                            .filter(p -> p.getStockQuantity() > 0 && p.getStockQuantity() < LOW_STOCK_THRESHOLD).count();
        long outOfStock  = productRepository.findAll().stream()
                            .filter(p -> p.getStockQuantity() == 0).count();

        double revenue   = orders.stream()
                            .filter(o -> !"CANCELLED".equals(o.getStatus()))
                            .mapToDouble(Order::getTotalAmount).sum();

        long pending    = orders.stream().filter(o -> "PENDING".equals(o.getStatus())).count();
        long shipped    = orders.stream().filter(o -> "SHIPPED".equals(o.getStatus())).count();
        long delivered  = orders.stream().filter(o -> "DELIVERED".equals(o.getStatus())).count();
        long cancelled  = orders.stream().filter(o -> "CANCELLED".equals(o.getStatus())).count();

        // Revenue by month (last 6 months)
        Map<String, Double> revenueByMonth = new LinkedHashMap<>();
        orders.stream()
            .filter(o -> o.getOrderDate() != null && !"CANCELLED".equals(o.getStatus()))
            .forEach(o -> {
                String month = o.getOrderDate().format(DateTimeFormatter.ofPattern("MMM yy"));
                revenueByMonth.merge(month, o.getTotalAmount(), Double::sum);
            });

        // Category breakdown
        Map<String, Long> productsByCategory = productRepository.findAll().stream()
                .filter(p -> p.getCategory() != null)
                .collect(Collectors.groupingBy(p -> p.getCategory(), Collectors.counting()));

        // Top 5 products by revenue
        Map<Long, double[]> productStats = new HashMap<>(); // [totalQty, totalRevenue]
        Map<Long, String> productNames   = new HashMap<>();
        Map<Long, String> productCats    = new HashMap<>();
        for (Order o : orders) {
            if ("CANCELLED".equals(o.getStatus())) continue;
            for (OrderItem item : o.getOrderItems()) {
                Long pid = item.getProduct().getId();
                productNames.put(pid, item.getProduct().getName());
                productCats.put(pid,  item.getProduct().getCategory());
                productStats.merge(pid,
                        new double[]{item.getQuantity(), item.getPriceAtPurchase() * item.getQuantity()},
                        (a, b) -> new double[]{a[0] + b[0], a[1] + b[1]});
            }
        }
        List<DashboardDTO.TopProductDTO> topProducts = productStats.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue()[1], a.getValue()[1]))
                .limit(5)
                .map(e -> DashboardDTO.TopProductDTO.builder()
                        .productId(e.getKey())
                        .productName(productNames.get(e.getKey()))
                        .category(productCats.get(e.getKey()))
                        .totalSold((long) e.getValue()[0])
                        .revenue(e.getValue()[1])
                        .build())
                .collect(Collectors.toList());

        // Recent 5 orders
        List<OrderDTO> recentOrders = orders.stream()
                .sorted((a, b) -> {
                    if (a.getOrderDate() == null) return 1;
                    if (b.getOrderDate() == null) return -1;
                    return b.getOrderDate().compareTo(a.getOrderDate());
                })
                .limit(5)
                .map(orderService::toDTO)
                .collect(Collectors.toList());

        return DashboardDTO.builder()
                .totalProducts(total)
                .totalOrders(orders.size())
                .totalRevenue(revenue)
                .pendingOrders(pending)
                .shippedOrders(shipped)
                .deliveredOrders(delivered)
                .cancelledOrders(cancelled)
                .lowStockCount(lowStock)
                .outOfStockCount(outOfStock)
                .revenueByMonth(revenueByMonth)
                .topProducts(topProducts)
                .recentOrders(recentOrders)
                .productsByCategory(productsByCategory)
                .build();
    }
}
