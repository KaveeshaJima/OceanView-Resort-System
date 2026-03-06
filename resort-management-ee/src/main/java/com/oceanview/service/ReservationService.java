package com.oceanview.service;

import com.oceanview.dto.ReservationRequestDTO;
import com.oceanview.dto.ReservationResponseDTO;
import com.oceanview.entity.Guest;
import com.oceanview.entity.Room;
import com.oceanview.entity.Reservation;
import com.oceanview.repository.GuestRepository;
import com.oceanview.repository.RoomRepository;
import com.oceanview.repository.ReservationRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;
import com.oceanview.enums.RoomStatus;


import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

public class ReservationService {

    private final ReservationRepository reservationRepo = new ReservationRepository();
    private final RoomRepository roomRepo = new RoomRepository();
    private final GuestRepository guestRepo = new GuestRepository();

    public ReservationResponseDTO createReservation(ReservationRequestDTO request) {
        // 1. Guest & Room Validation
        Guest guest = guestRepo.findById(request.getGuestId());
        if (guest == null) throw new RuntimeException("Guest not found!");

        Room room = roomRepo.findById(request.getRoomNo());
        if (room == null) throw new RuntimeException("Room not found!");

        // 2. Availability Check
        boolean isAvailable = reservationRepo.isRoomAvailable(
                request.getRoomNo(), request.getCheckIn(), request.getCheckOut());

        if (!isAvailable) {
            throw new RuntimeException("Room is already booked for these dates!");
        }

        // 3. Calculation Logic
        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        if (nights <= 0) throw new RuntimeException("Check-out date must be after Check-in!");

        BigDecimal totalPrice = room.getPricePerNight().multiply(new BigDecimal(nights));

        // 4. Create Entity & Save
        Reservation res = new Reservation();
        res.setGuest(guest);
        res.setRoom(room);
        res.setCheckIn(request.getCheckIn());
        res.setCheckOut(request.getCheckOut());
        res.setTotalNights((int) nights);
        res.setTotalPrice(totalPrice);
        res.setStatus(Reservation.ReservationStatus.CONFIRMED);

        reservationRepo.save(res);

        // 5. Convert to ResponseDTO and return
        return mapToDTO(res);
    }

    public byte[] generateInvoicePDF(Integer resId) {
        Reservation res = reservationRepo.findById(resId);
        if (res == null) throw new RuntimeException("Reservation not found!");

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BaseColor.BLUE);
            Paragraph title = new Paragraph("OCEANVIEW RESORT - INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ")); // හිස් පේළියක්

            // Content
            document.add(new Paragraph("Reservation ID: " + res.getResId()));
            document.add(new Paragraph("Guest Name: " + res.getGuest().getName()));
            document.add(new Paragraph("Room Number: " + res.getRoom().getRoomNo()));
            document.add(new Paragraph("Check-in Date: " + res.getCheckIn()));
            document.add(new Paragraph("Check-out Date: " + res.getCheckOut()));
            document.add(new Paragraph("Total Nights: " + res.getTotalNights()));
            document.add(new Paragraph("--------------------------------------------------"));

            Font priceFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);
            document.add(new Paragraph("TOTAL PRICE: LKR " + res.getTotalPrice(), priceFont));

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }

        return out.toByteArray();
    }
    // ReservationService.java ඇතුළට මේවා එකතු කරන්න

    public List<ReservationResponseDTO> getAllReservations() {
        return reservationRepo.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ReservationResponseDTO updateReservation(Integer id, ReservationRequestDTO request) {
        Reservation res = reservationRepo.findById(id);
        if (res == null) throw new RuntimeException("Reservation not found!");

        // දින වෙනස් වෙනවා නම් ආයෙත් Availability check කරන්න ඕනේ
        if (!res.getCheckIn().equals(request.getCheckIn()) || res.getRoom().getRoomNo() != request.getRoomNo()) {
            if (!reservationRepo.isRoomAvailable(request.getRoomNo(), request.getCheckIn(), request.getCheckOut())) {
                throw new RuntimeException("Room is not available for new dates!");
            }
        }

        // දත්ත Update කිරීම
        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        BigDecimal totalPrice = res.getRoom().getPricePerNight().multiply(new BigDecimal(nights));

        res.setCheckIn(request.getCheckIn());
        res.setCheckOut(request.getCheckOut());
        res.setTotalNights((int) nights);
        res.setTotalPrice(totalPrice);

        reservationRepo.update(res);
        return mapToDTO(res);
    }

    public String cancelReservation(Integer id) {
        Reservation res = reservationRepo.findById(id);
        if (res == null) throw new RuntimeException("Reservation not found!");

        Room room = res.getRoom();
        if (room != null) {
            // මෙතන කෙලින්ම RoomStatus.AVAILABLE කියලා පාවිච්චි කරන්න පුළුවන්
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepo.update(room);
        }

        reservationRepo.delete(id);
        return "Reservation deleted and room status updated!";
    }

    private ReservationResponseDTO mapToDTO(Reservation res) {
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setResId(res.getResId());

        // Guest null ද කියලා check කරමු
        if (res.getGuest() != null) {
            dto.setGuestId(res.getGuest().getId());
            dto.setGuestName(res.getGuest().getName());
        } else {
            dto.setGuestName("Unknown Guest");
        }

        // Room null ද කියලා check කරමු
        if (res.getRoom() != null) {
            dto.setRoomNo(res.getRoom().getRoomNo());
        }

        dto.setCheckIn(res.getCheckIn());
        dto.setCheckOut(res.getCheckOut());
        dto.setTotalNights(res.getTotalNights());
        dto.setTotalPrice(res.getTotalPrice());
        dto.setStatus(res.getStatus() != null ? res.getStatus().name() : "PENDING");

        return dto;
    }
}