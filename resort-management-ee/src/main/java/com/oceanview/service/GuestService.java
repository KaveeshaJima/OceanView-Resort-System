package com.oceanview.service;

import com.oceanview.dto.GuestRequestDTO;
import com.oceanview.dto.GuestResponseDTO;
import com.oceanview.entity.Guest;
import com.oceanview.repository.GuestRepository;
import java.util.List;
import java.util.stream.Collectors;

public class GuestService {
    private final GuestRepository guestRepository = new GuestRepository();

    public GuestResponseDTO createGuest(GuestRequestDTO request) {
        Guest guest = new Guest();
        guest.setName(request.getName());
        guest.setAddress(request.getAddress());
        guest.setContactNo(request.getContactNo());

        Guest saved = guestRepository.save(guest);
        return mapToDTO(saved);
    }

    public List<GuestResponseDTO> getAllGuests() {
        return guestRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private GuestResponseDTO mapToDTO(Guest guest) {
        GuestResponseDTO dto = new GuestResponseDTO();
        dto.setId(guest.getId());
        dto.setName(guest.getName());
        dto.setAddress(guest.getAddress());
        dto.setContactNo(guest.getContactNo());
        return dto;
    }

    public GuestResponseDTO updateGuest(Integer id, GuestRequestDTO request) {
        Guest existingGuest = guestRepository.findById(id);
        if (existingGuest == null) {
            throw new RuntimeException("Guest not found with ID: " + id);
        }

        existingGuest.setName(request.getName());
        existingGuest.setAddress(request.getAddress());
        existingGuest.setContactNo(request.getContactNo());

        Guest updated = guestRepository.update(existingGuest);
        return mapToDTO(updated);
    }

    public void deleteGuest(Integer id) {
        guestRepository.delete(id);
    }


}