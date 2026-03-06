package com.oceanview.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestResponseDTO {
    private Integer id;
    private String name;
    private String address;
    private String contactNo;
}