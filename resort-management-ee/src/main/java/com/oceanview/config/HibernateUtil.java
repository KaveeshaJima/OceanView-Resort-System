package com.oceanview.config;

import com.oceanview.entity.Reservation;
import com.oceanview.entity.User;
import com.oceanview.entity.Guest;
import com.oceanview.entity.Room;
import lombok.Getter;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {

    @Getter // Field 'sessionFactory' may have Lombok @Getter warning එක මෙතනින් අයින් වෙනවා
    private static final SessionFactory sessionFactory = buildSessionFactory();

    private static SessionFactory buildSessionFactory() {
        try {
            return new Configuration()
                    .configure()
                    .addAnnotatedClass(User.class)  // User register කරන්න
                    .addAnnotatedClass(Guest.class)
                    .addAnnotatedClass(Room.class)
                    .addAnnotatedClass(Reservation.class)
                    .buildSessionFactory();
        } catch (Throwable ex) {
            System.err.println("Initial SessionFactory creation failed." + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }


    public static void shutdown() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }
}