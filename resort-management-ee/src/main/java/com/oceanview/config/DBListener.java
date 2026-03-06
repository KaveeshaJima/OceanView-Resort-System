package com.oceanview.config;


import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class DBListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("Starting Hibernate via Listener...");
        HibernateUtil.getSessionFactory();
        System.out.println("Hibernate Initialized!");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        if (HibernateUtil.getSessionFactory() != null) {
            HibernateUtil.getSessionFactory().close();
        }
    }
}
