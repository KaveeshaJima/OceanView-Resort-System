package com.oceanview.dto;

public class DashboardDTO {
    private long totalReservations;
    private long availableRooms;
    private long totalGuests;
    private double totalRevenue;
    private long occupiedRooms; // Map එක වෙනුවට මේක ගමු

    // Getters and Setters සේරටම හදන්න...
    public long getTotalReservations() { return totalReservations; }
    public void setTotalReservations(long totalReservations) { this.totalReservations = totalReservations; }

    public long getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(long availableRooms) { this.availableRooms = availableRooms; }

    public long getTotalGuests() { return totalGuests; }
    public void setTotalGuests(long totalGuests) { this.totalGuests = totalGuests; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(long occupiedRooms) { this.occupiedRooms = occupiedRooms; }
}