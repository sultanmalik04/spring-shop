package com.sultan.springshop.service.image;

import org.springframework.web.multipart.MultipartFile;

import com.sultan.springshop.model.Image;

public interface IImageService {
    Image getImageById(Long id);

    void deleteImageById(Long id);

    Image saveImage(MultipartFile file, Long productId);

    void updateImage(MultipartFile file, Long imageId);
}
