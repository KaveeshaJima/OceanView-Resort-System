package com.oceanview.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

public class JwtUtil {
    // මේක රහස් යතුරක් (Secret Key). මේකෙන් තමයි token එක sign කරන්නේ.
    private static final Key KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long EXPIRATION_TIME = 86400000; // පැය 24ක් (Milliseconds වලින්)

    public static String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role) // Role එක token එක ඇතුළටම දානවා
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(KEY)
                .compact();
    }

    public static Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // පස්සේ කාලෙක Token එක valid ද කියලා බලන්න මේ KEY එකම ඕන වෙනවා.
    public static Key getKey() {
        return KEY;
    }
}