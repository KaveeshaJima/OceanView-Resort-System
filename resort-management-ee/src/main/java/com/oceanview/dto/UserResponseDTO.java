package com.oceanview.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserResponseDTO {

    private Integer id;
    private String name;
    private String email;
    private String role;
}