package com.example.demo.controller;

import com.example.demo.entity.ProductEntity;
import com.example.demo.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ItemService productService;

    @Autowired
    public ProductController(ItemService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductEntity> getAllItems() {
        return productService.getAllItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductEntity> getItemById(@PathVariable UUID id) {
        return productService.getItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProductEntity createItem(@RequestBody ProductEntity product) {
        return productService.createItem(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductEntity> updateItem(@PathVariable UUID id, @RequestBody ProductEntity product) {
        return productService.updateItem(id, product)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable UUID id) {
        if (productService.deleteItem(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}