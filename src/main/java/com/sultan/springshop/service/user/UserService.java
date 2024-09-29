package com.sultan.springshop.service.user;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.sultan.springshop.dto.UserDto;
import com.sultan.springshop.exceptions.AlreadyExistsException;
import com.sultan.springshop.exceptions.ResourceNotFoundException;
import com.sultan.springshop.model.User;
import com.sultan.springshop.repository.UserRepository;
import com.sultan.springshop.request.CreateUserRequest;
import com.sultan.springshop.request.UserUpadteRquest;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User createUser(CreateUserRequest request) {
        return Optional.of(request).filter(user -> !userRepository.existsByEmail(request.getEmail())).map(req -> {
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            return userRepository.save(user);
        }).orElseThrow(() -> new AlreadyExistsException(request.getEmail() + " already exists!"));
    }

    @Override
    public User updateUser(UserUpadteRquest request, Long userId) {
        return userRepository.findById(userId).map(existingUser -> {
            existingUser.setFirstName(request.getFirstName());
            existingUser.setLastName(request.getLastName());
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.findById(userId).ifPresentOrElse(userRepository::delete, () -> {
            throw new ResourceNotFoundException("User not found");
        });
    }

    @Override
    public UserDto convertUsertoDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

}
