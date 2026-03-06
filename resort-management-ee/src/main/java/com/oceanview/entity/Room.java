package com.oceanview.entity;

import com.oceanview.enums.RoomStatus;
import com.oceanview.enums.RoomType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "rooms")
@Getter
@Setter
public class Room {

    @Id
    @Column(name = "room_no")
    private int roomNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    @Column(name = "price_per_night")
    private BigDecimal pricePerNight;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "description")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;
}