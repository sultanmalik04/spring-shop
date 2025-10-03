package com.sultan.springshop.repository;

import org.springframework.stereotype.Repository;

import com.sultan.springshop.model.Product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryName(String category);

    List<Product> findByBrand(String brand);

    List<Product> findByCategoryNameAndBrand(String category, String brand);

    List<Product> findByName(String name);

    Long countByBrandAndName(String brand, String name);

    List<Product> findByBrandAndName(String brand, String name);

    boolean existsByNameAndBrand(String name, String brand);

    List<Product> findByNameContainingIgnoreCase(String name);

}
