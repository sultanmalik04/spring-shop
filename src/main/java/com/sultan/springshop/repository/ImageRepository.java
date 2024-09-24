package com.sultan.springshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sultan.springshop.model.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

}
