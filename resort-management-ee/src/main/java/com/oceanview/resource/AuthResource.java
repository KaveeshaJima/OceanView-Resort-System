package com.oceanview.resource;

import com.oceanview.dto.LoginRequestDTO;
import com.oceanview.entity.User;
import com.oceanview.repository.UserRepository; // ඔයා හදපු UserRepository එක
import com.oceanview.utils.JwtUtil;
import com.oceanview.utils.PasswordUtil;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    private final UserRepository userRepo = new UserRepository();

    @POST
    @Path("/login")
    public Response login(LoginRequestDTO loginRequest) {
        // 1. Email එකෙන් User ව හොයමු
        User user = userRepo.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\": \"Invalid Email or Password\"}").build();
        }

        // 2. Password එක පරීක්ෂා කරමු
        if (PasswordUtil.checkPassword(loginRequest.getPassword(), user.getPassword())) {
            // 3. හරි නම් Token එක හදමු
            String token = JwtUtil.generateToken(user.getEmail(), user.getRole().name());
            return Response.ok("{\"token\": \"" + token + "\"}").build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\": \"Invalid Email or Password\"}").build();
        }
    }
}
