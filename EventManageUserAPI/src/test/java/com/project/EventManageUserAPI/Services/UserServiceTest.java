package com.project.EventManageUserAPI.Services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.project.EventManageUserAPI.Repositories.UserRepo;
import com.project.EventManageUserAPI.exceptions.ResourceNotFoundException;
import com.project.EventManageUserAPI.models.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetUser_NotFound_ThrowsException() {
        // Arrange: Tell the mock to return empty when ID 99 is requested
        when(userRepo.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert: Verify the custom exception is thrown
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUser(99L);
        });
    }

    @Test
    void testUpdateUser_Success() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setName("Old Name");

        User incomingData = new User();
        incomingData.setName("New Name");

        when(userRepo.findById(1L)).thenReturn(Optional.of(existingUser));

        // Act
        userService.UpdateUser(1L, incomingData);

        // Assert: Check if the name was updated correctly
        assertEquals("New Name", existingUser.getName());
        verify(userRepo, times(1)).save(existingUser);
    }
}