package com.sultan.springshop.service.image;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sultan.springshop.exceptions.ResourceNotFoundException;
import com.sultan.springshop.model.Image;
import com.sultan.springshop.repository.ImageRepository;
import com.sultan.springshop.service.product.IProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageService implements IImageService {

    private final ImageRepository imageRepository;
    private final IProductService productService;

    @Override
    public Image getImageById(Long id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No image found with id: " + id));
    }

    @Override
    public void deleteImageById(Long id) {
        imageRepository.findById(id).ifPresentOrElse(imageRepository::delete, () -> {
            throw new ResourceNotFoundException("No image found with id: " + id);
        });
    }

    @Override
    public Image saveImage(MultipartFile file, Long productId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'saveImage'");
    }

    @Override
    public void updateImage(MultipartFile file, Long imageId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateImage'");
    }

}
