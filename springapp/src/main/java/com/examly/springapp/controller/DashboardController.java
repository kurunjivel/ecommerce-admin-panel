package com.examly.springapp.controller;

import com.examly.springapp.dto.ApiResponse;
import com.examly.springapp.dto.DashboardDTO;
import com.examly.springapp.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Analytics and KPI APIs")
public class DashboardController {

    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get all dashboard analytics")
    public ResponseEntity<ApiResponse<DashboardDTO>> getDashboard() {
        log.info("GET /api/dashboard");
        DashboardDTO data = dashboardService.getDashboard();
        return ResponseEntity.ok(ApiResponse.success("Dashboard loaded", data));
    }
}
