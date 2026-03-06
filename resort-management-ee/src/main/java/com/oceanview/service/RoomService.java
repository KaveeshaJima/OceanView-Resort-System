package com.oceanview.service;

import com.oceanview.dto.RoomRequestDTO;
import com.oceanview.dto.RoomResponseDTO;
import com.oceanview.entity.Room;
import com.oceanview.repository.RoomRepository;

import java.util.List;
import java.util.stream.Collectors;

public class RoomService {

    private final RoomRepository repository = new RoomRepository();

    public void addRoom(RoomRequestDTO dto) {
        Room room = mapToEntity(dto);
        repository.save(room);
    }

    public void updateRoom(int id, RoomRequestDTO dto) {
        Room existing = repository.findById(id);

        if (existing == null) {
            throw new RuntimeException("Room not found with id: " + id);
        }

        existing.setRoomType(dto.getRoomType());
        existing.setPricePerNight(dto.getPricePerNight());
        existing.setStatus(dto.getStatus());
        existing.setCapacity(dto.getCapacity());
        existing.setDescription(dto.getDescription());
        existing.setImageUrl(dto.getImageUrl());

        repository.update(existing);
    }

    public List<RoomResponseDTO> getAllRooms() {
        return repository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void deleteRoom(int id) {
        repository.delete(id);
    }

    private Room mapToEntity(RoomRequestDTO dto) {
        Room room = new Room();
        room.setRoomNo(dto.getRoomNo());
        room.setRoomType(dto.getRoomType());
        room.setPricePerNight(dto.getPricePerNight());
        room.setStatus(dto.getStatus());
        room.setCapacity(dto.getCapacity());
        room.setDescription(dto.getDescription());
        room.setImageUrl(dto.getImageUrl());
        return room;
    }

    private RoomResponseDTO mapToDTO(Room room) {
        return new RoomResponseDTO(
                room.getRoomNo(),
                room.getRoomType(),
                room.getPricePerNight(),
                room.getStatus(),
                room.getCapacity(),
                room.getDescription(),
                room.getImageUrl()
        );
    }
}