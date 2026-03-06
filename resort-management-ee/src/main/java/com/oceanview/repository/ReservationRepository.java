package com.oceanview.repository;

import com.oceanview.config.HibernateUtil;
import com.oceanview.entity.Reservation;
import org.hibernate.Session;
import org.hibernate.Transaction;
import java.time.LocalDate;
import java.util.List;

public class ReservationRepository {

    public void save(Reservation res) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            session.persist(res);
            tx.commit();
        } catch (Exception e) { if (tx != null) tx.rollback(); throw e; }
    }

    public Reservation findById(Integer id) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.get(Reservation.class, id);
        }
    }



    public List<Reservation> findAll() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            // HQL Join Fetch පාවිච්චි කරලා එකපාරින්ම සම්බන්ධිත objects ලෝඩ් කරගන්නවා
            return session.createQuery(
                            "SELECT DISTINCT r FROM Reservation r " +
                                    "LEFT JOIN FETCH r.guest " +
                                    "LEFT JOIN FETCH r.room", Reservation.class)
                    .list();
        }
    }

    public void update(Reservation res) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            session.merge(res);
            tx.commit();
        } catch (Exception e) { if (tx != null) tx.rollback(); throw e; }
    }

    public void delete(Integer id) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            Reservation res = session.get(Reservation.class, id);
            if (res != null) session.remove(res);
            tx.commit();
        } catch (Exception e) { if (tx != null) tx.rollback(); throw e; }
    }
    // දින වකවානු අනුව Room එකක් දැනටමත් Book කරලාද කියලා බලන logic එක
    public boolean isRoomAvailable(Integer roomNo, LocalDate checkIn, LocalDate checkOut) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            String hql = "SELECT count(r) FROM Reservation r " +
                    "WHERE r.room.roomNo = :roomNo " +
                    "AND r.status != 'CANCELLED' " +
                    "AND ((:checkIn < r.checkOut) AND (:checkOut > r.checkIn))";
            Long count = session.createQuery(hql, Long.class)
                    .setParameter("roomNo", roomNo)
                    .setParameter("checkIn", checkIn)
                    .setParameter("checkOut", checkOut)
                    .uniqueResult();
            return count == 0;
        }
    }
}