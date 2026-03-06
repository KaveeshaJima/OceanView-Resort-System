package com.oceanview.filter;

import com.oceanview.utils.JwtUtil;
import com.oceanview.utils.Secured;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;
import java.security.Principal;

@Secured
@Provider
@Priority(Priorities.AUTHENTICATION) // Authentication එක Authorization එකට කලින් වෙන්න ඕනේ
public class AuthenticationFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // 1. Header එකෙන් Authorization ගමු
        String authHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        // 2. Bearer Token එකක් තියෙනවද බලමු
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            requestContext.abortWith(
                    Response.status(Response.Status.UNAUTHORIZED)
                            .entity("{\"message\": \"Missing or invalid Authorization header\"}")
                            .build());
            return;
        }

        String token = authHeader.substring("Bearer ".length()).trim();

        try {
            // 3. Token එක පරීක්ෂා කරලා දත්ත (Claims) ටික ගමු
            Claims claims = Jwts.parser()
                    .setSigningKey(JwtUtil.getKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String email = claims.getSubject();
            String role = claims.get("role", String.class);

            // 4. Custom SecurityContext එකක් සෙට් කරමු (මෙතනින් තමයි Role එක 'isUserInRole' එකට යන්නේ)
            final SecurityContext currentSecurityContext = requestContext.getSecurityContext();
            requestContext.setSecurityContext(new SecurityContext() {
                @Override
                public Principal getUserPrincipal() { return () -> email; }

                @Override
                public boolean isUserInRole(String r) {
                    return role != null && role.equalsIgnoreCase(r);
                }

                @Override
                public boolean isSecure() { return currentSecurityContext.isSecure(); }

                @Override
                public String getAuthenticationScheme() { return "Bearer"; }
            });

        } catch (ExpiredJwtException e) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\": \"Token has expired\"}").build());
        } catch (SignatureException | MalformedJwtException e) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\": \"Invalid token signature\"}").build());
        } catch (Exception e) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\": \"Authentication failed\"}").build());
        }
    }
}