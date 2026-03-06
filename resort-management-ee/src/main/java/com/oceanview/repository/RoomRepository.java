package com.oceanview.repository;

import com.oceanview.config.HibernateUtil;
import com.oceanview.entity.Room;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class RoomRepository {

    public void save(Room room) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = session.beginTransaction();
        session.persist(room);
        tx.commit();
        session.close();
    }

    public void update(Room room) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = session.beginTransaction();
        session.merge(room);
        tx.commit();
        session.close();
    }

    public Room findById(int id) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Room room = session.get(Room.class, id);
        session.close();
        return room;
    }

    public List<Room> findAll() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        List<Room> rooms = session.createQuery("FROM Room", Room.class).list();
        session.close();
        return rooms;
    }

    public void delete(int id) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = session.beginTransaction();
        Room room = session.get(Room.class, id);
        if (room != null) {
            session.remove(room);
        }
        tx.commit();
        session.close();
    }
}