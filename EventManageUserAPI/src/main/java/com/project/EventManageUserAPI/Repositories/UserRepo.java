package com.project.EventManageUserAPI.Repositories;

import com.project.EventManageUserAPI.models.User;

public interface UserRepo extends org.springframework.data.jpa.repository.JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    User findByEmail(String email);
}
