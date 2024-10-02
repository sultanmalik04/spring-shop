package com.sultan.springshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sultan.springshop.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    User findByEmail(String email);
}
