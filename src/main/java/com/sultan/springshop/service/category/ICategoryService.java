package com.sultan.springshop.service.category;

import java.util.List;

import com.sultan.springshop.model.Category;

public interface ICategoryService {
    Category getcategoryById(Long id);

    Category getCategoryByName(String name);

    List<Category> getAllCategory();

    Category addCategory(Category category);

    Category updateCategory(Category category, Long id);

    void deleteCategoryById(Long id);
}
