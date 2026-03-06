package com.oceanview.service;

import com.oceanview.config.HibernateUtil;
import com.oceanview.dto.DashboardDTO;
import org.hibernate.Session;
import java.util.HashMap;
import java.util.Map;

public class DashboardService {

    public DashboardDTO getDashboardSummary() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            DashboardDTO dto = new DashboardDTO();

            dto.setTotalReservations(session.createQuery("SELECT count(r) FROM Reservation r", Long.class).uniqueResult());
            dto.setAvailableRooms(session.createQuery("SELECT count(rm) FROM Room rm WHERE rm.status = 'AVAILABLE'", Long.class).uniqueResult());
            dto.setTotalGuests(session.createQuery("SELECT count(g) FROM Guest g", Long.class).uniqueResult());

            Object revenueObj = session.createQuery("SELECT SUM(r.totalPrice) FROM Reservation r WHERE r.status != 'CANCELLED'")
                    .uniqueResult();

            if (revenueObj instanceof Number) {
                dto.setTotalRevenue(((Number) revenueObj).doubleValue());
            } else {
                dto.setTotalRevenue(0.0);
            }

            Long occupied = session.createQuery("SELECT count(rm) FROM Room rm WHERE rm.status != 'AVAILABLE'", Long.class).uniqueResult();
            dto.setOccupiedRooms(occupied != null ? occupied : 0L);

            return dto;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}