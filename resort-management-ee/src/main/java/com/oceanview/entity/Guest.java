package com.oceanview.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Guests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guest_id")
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "contact_no", nullable = false)
    private String contactNo;
}