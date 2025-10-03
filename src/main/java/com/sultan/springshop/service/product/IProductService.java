package com.sultan.springshop.service.product;

import java.util.List;

import com.sultan.springshop.dto.ProductDto;
import com.sultan.springshop.model.Product;
import com.sultan.springshop.request.AddProductRequest;
import com.sultan.springshop.request.UpdateProductRequest;

public interface IProductService {
    Product addProduct(AddProductRequest product);

    Product getProductById(Long id);

    void deleteProductById(Long id);

    Product updateProduct(UpdateProductRequest request, Long id);

    List<Product> getAllProducts();

    List<Product> getProductsByCategoryName(String category);

    List<Product> getProductsByBrand(String brand);

    List<Product> getProductsByCategoryAndbrand(String category, String brand);

    List<Product> getProductsByName(String name);

    List<Product> getProductsByBrandAndName(String brand, String name);

    Long countProductsByBrandAndName(String brand, String name);

    ProductDto convertToDto(Product product);

    List<ProductDto> getConvertedProducts(List<Product> products);

    List<Product> searchProducts(String keyword);
}
