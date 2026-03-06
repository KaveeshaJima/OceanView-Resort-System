package com.oceanview.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ReservationResponseDTO {
    private Integer resId;
    private Integer guestId;
    private String guestName; // Guest ගේ නම පෙන්නන්න
    private Integer roomNo;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkIn;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkOut;

    private Integer totalNights;
    private BigDecimal totalPrice;
    private String status;
}