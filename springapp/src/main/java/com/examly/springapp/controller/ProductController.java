package com.examly.springapp.controller;

import com.examly.springapp.dto.ProductDTO;
import com.examly.springapp.model.Product;
import com.examly.springapp.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Product management APIs")
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    // ── CREATE ───────────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new product")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody Product product) {
        log.info("POST /api/products");
        ProductDTO created = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── READ (list with filter + sort) ────────────────────────────────────

    @GetMapping
    @Operation(summary = "Get all products with optional filters and sorting")
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction) {

        log.info("GET /api/products");
        List<ProductDTO> products = productService.getProducts(category, minPrice, maxPrice, searchKeyword, sortBy, direction);
        return ResponseEntity.ok(products);
    }

    // ── READ (single) ─────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        log.info("GET /api/products/{}", id);
        return ResponseEntity.ok(productService.getById(id));
    }

    // ── UPDATE ────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing product")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id,
                                                    @Valid @RequestBody Product product) {
        log.info("PUT /api/products/{}", id);
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    // ── DELETE ────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product by ID")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        log.info("DELETE /api/products/{}", id);
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
