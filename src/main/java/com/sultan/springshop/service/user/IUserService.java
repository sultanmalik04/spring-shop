package com.sultan.springshop.service.user;

import com.sultan.springshop.dto.UserDto;
import com.sultan.springshop.model.User;
import com.sultan.springshop.request.CreateUserRequest;
import com.sultan.springshop.request.UserUpadteRquest;

public interface IUserService {

    User getUserById(Long userId);

    User createUser(CreateUserRequest request);

    User updateUser(UserUpadteRquest request, Long userId);

    void deleteUser(Long userId);

    UserDto convertUsertoDto(User user);

}
