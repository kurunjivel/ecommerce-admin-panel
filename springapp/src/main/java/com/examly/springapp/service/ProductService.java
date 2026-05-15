package com.examly.springapp.service;

import com.examly.springapp.dto.ProductDTO;
import com.examly.springapp.exception.ProductNotFoundException;
import com.examly.springapp.model.Product;
import com.examly.springapp.repository.ProductRepository;
import com.examly.springapp.repository.ProductSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    // ── CREATE ──────────────────────────────────────────────────────────────

    public ProductDTO createProduct(Product product) {
        log.info("Creating product: {}", product.getName());
        Product saved = productRepository.save(product);
        log.info("Product created with id={}", saved.getId());
        return toDTO(saved);
    }

    // ── READ (list) ─────────────────────────────────────────────────────────

    public List<ProductDTO> getProducts(String category, Double minPrice, Double maxPrice,
                                        String searchKeyword, String sortBy, String direction) {
        log.info("Fetching products — category={}, minPrice={}, maxPrice={}, keyword={}, sortBy={}, direction={}",
                category, minPrice, maxPrice, searchKeyword, sortBy, direction);

        Specification<Product> spec = ProductSpecification.filter(category, minPrice, maxPrice, searchKeyword);

        Sort sort = buildSort(sortBy, direction);
        List<Product> products = productRepository.findAll(spec, sort);
        return products.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── READ (single) ────────────────────────────────────────────────────────

    public ProductDTO getById(Long id) {
        log.info("Fetching product id={}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Product not found id={}", id);
                    return new ProductNotFoundException();
                });
        return toDTO(product);
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────

    public ProductDTO updateProduct(Long id, Product updated) {
        log.info("Updating product id={}", id);
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Product not found id={}", id);
                    return new ProductNotFoundException();
                });

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setCategory(updated.getCategory());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setImageUrl(updated.getImageUrl());

        Product saved = productRepository.save(existing);
        log.info("Product updated id={}", saved.getId());
        return toDTO(saved);
    }

    // ── DELETE ───────────────────────────────────────────────────────────────

    public void deleteProduct(Long id) {
        log.info("Deleting product id={}", id);
        if (!productRepository.existsById(id)) {
            log.warn("Product not found id={}", id);
            throw new ProductNotFoundException();
        }
        productRepository.deleteById(id);
        log.info("Product deleted id={}", id);
    }

    // ── MAPPING ──────────────────────────────────────────────────────────────

    public ProductDTO toDTO(Product p) {
        return ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .category(p.getCategory())
                .stockQuantity(p.getStockQuantity())
                .imageUrl(p.getImageUrl())
                .build();
    }

    // ── HELPERS ──────────────────────────────────────────────────────────────

    private Sort buildSort(String sortBy, String direction) {
        if (sortBy == null || sortBy.isBlank()) return Sort.unsorted();
        Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return Sort.by(dir, sortBy);
    }
}
