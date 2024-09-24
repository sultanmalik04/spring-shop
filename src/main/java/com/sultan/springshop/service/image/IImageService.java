package com.sultan.springshop.service.image;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.sultan.springshop.dto.ImageDTO;
import com.sultan.springshop.model.Image;

public interface IImageService {
    Image getImageById(Long id);

    void deleteImageById(Long id);

    List<ImageDTO> saveImages(List<MultipartFile> file, Long productId);

    void updateImage(MultipartFile file, Long imageId);
}
