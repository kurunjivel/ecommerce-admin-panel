package com.examly.springapp.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDTO {
    // KPIs
    private long totalProducts;
    private long totalOrders;
    private double totalRevenue;
    private long pendingOrders;
    private long shippedOrders;
    private long deliveredOrders;
    private long cancelledOrders;
    private long lowStockCount;
    private long outOfStockCount;

    // Revenue breakdown
    private Map<String, Double> revenueByMonth;

    // Top selling products
    private List<TopProductDTO> topProducts;

    // Recent orders
    private List<OrderDTO> recentOrders;

    // Category breakdown
    private Map<String, Long> productsByCategory;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopProductDTO {
        private Long productId;
        private String productName;
        private String category;
        private long totalSold;
        private double revenue;
    }
}
