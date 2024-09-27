package com.sultan.springshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sultan.springshop.model.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    public List<Image> findByProductId(Long id);
}
