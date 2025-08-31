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

    public Product getProductById(int id) {
        return productRepository.getProductById(id);
    }

    public Product addNewProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(int id, Product product) {
        if(product == null || id < 0) {
            return null;
        }
        return productRepository.save(product);
    }
    public  void deleteProduct(int id) {
        if(id < 0) {
            return;
        }
        productRepository.deleteAll();
    }

}
