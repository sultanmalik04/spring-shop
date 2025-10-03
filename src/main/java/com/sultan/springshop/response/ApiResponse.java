package com.sultan.springshop.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor // Add NoArgsConstructor for flexibility
@Data
public class ApiResponse {
    private String message;
    private Object data;
    private boolean success;

    public ApiResponse(String message, Object data) {
        this.message = message;
        this.data = data;
        this.success = true; // Default to success true for this constructor
    }

    public ApiResponse(String message, Object data, boolean success) {
        this.message = message;
        this.data = data;
        this.success = success;
    }
}
