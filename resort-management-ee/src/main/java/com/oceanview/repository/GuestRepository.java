package com.oceanview.repository;

import com.oceanview.config.HibernateUtil;
import com.oceanview.entity.Guest;
import org.hibernate.Session;
import org.hibernate.Transaction;
import java.util.List;

public class GuestRepository {
    // ... (save, findAll, findById methods )
    public Guest save(Guest guest) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            session.persist(guest);
            transaction.commit();
            return guest;
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            throw e;
        }
    }

    public List<Guest> findAll() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.createQuery("from Guest", Guest.class).list();
        }
    }

    public Guest findById(Integer id) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.get(Guest.class, id);
        }
    }

    public Guest update(Guest guest) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            Guest updated = session.merge(guest);
            transaction.commit();
            return updated;
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            throw e;
        }
    }

    public void delete(Integer id) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            Guest guest = session.get(Guest.class, id);
            if (guest != null) session.remove(guest);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            throw e;
        }
    }
}