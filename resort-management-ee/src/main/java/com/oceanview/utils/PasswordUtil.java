package com.oceanview.utils;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtil {

    // Password එක encrypt (hash) කිරීමට
    public static String hashPassword(String plainTextPassword) {
        return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt());
    }

    // Login වෙද්දී දෙන password එක database එකේ තියෙන hash එකත් එක්ක සැසඳීමට
    public static boolean checkPassword(String plainTextPassword, String hashedPassword) {
        return BCrypt.checkpw(plainTextPassword, hashedPassword);
    }
}
