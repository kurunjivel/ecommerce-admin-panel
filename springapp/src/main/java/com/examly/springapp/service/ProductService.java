package com.examly.springapp.service;

import com.examly.springapp.model.Product;
import com.examly.springapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getProductDetails() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product addNewProduct(Product product) {
        return productRepository.save(product);
    }

//    public Product updateProduct(Long id, Product product) {
//        return productRepository.findById(id)
//                .map(existing -> {
//                    existing.setName(product.getName());
//                    existing.setDescription(product.getDescription());
//                    existing.setPrice(product.getPrice());
//                    existing.setCategory(product.getCategory());
//                    existing.setStockQuantity(product.getStockQuantity());
//                    existing.setImageUrl(product.getImageUrl());
//                    return productRepository.save(existing);
//                })
//                .orElse(null);
//    }
    public  void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Object deleproduct(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleproduct'");
    }

}
