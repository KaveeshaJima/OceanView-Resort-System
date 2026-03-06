package com.oceanview.dto;

import com.fasterxml.jackson.annotation.JsonFormat; // මේක import කරන්න
import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservationRequestDTO {
    private Integer guestId;
    private Integer roomNo;

    @JsonFormat(pattern = "yyyy-MM-dd") // Format එක මෙහෙම තියෙන්න ඕනේ
    private LocalDate checkIn;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkOut;
}