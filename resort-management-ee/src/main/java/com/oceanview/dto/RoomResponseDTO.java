package com.oceanview.dto;

import com.oceanview.enums.RoomStatus;
import com.oceanview.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class RoomResponseDTO {

    private int roomNo;
    private RoomType roomType;
    private BigDecimal pricePerNight;
    private RoomStatus status;
    private Integer capacity;
    private String description;
    private String imageUrl;
}