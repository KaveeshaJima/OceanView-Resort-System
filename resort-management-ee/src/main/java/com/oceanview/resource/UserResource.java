package com.oceanview.resource;

import com.oceanview.dto.*;
import com.oceanview.service.UserService;
import com.oceanview.utils.RolesAllowed;
import com.oceanview.utils.Secured;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    private UserService userService = new UserService();

    @GET
    public Response getAllUsers() {
        return Response.ok(userService.getAllUsers()).build();
    }

    @GET
    @Path("/{id}")
    public Response getUserById(@PathParam("id") int id) {
        return Response.ok(userService.getUserById(id)).build();
    }

    @POST
    @Secured      // මුලින්ම Token එක බලනවා
    @RolesAllowed({"ADMIN"})
    public Response createUser(@Valid UserRequestDTO request) {
        try {
            UserResponseDTO createdUser = userService.createUser(request);
            return Response.status(Response.Status.CREATED).entity(createdUser).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @PUT
    @Path("/{id}")
    @Secured      // මුලින්ම Token එක බලනවා
    @RolesAllowed({"ADMIN"})
    public Response updateUser(@PathParam("id") int id, @Valid UserRequestDTO request) {
        return Response.ok(userService.updateUser(id, request)).build();
    }

    @DELETE
    @Path("/{id}")
    @Secured      // මුලින්ම Token එක බලනවා
    @RolesAllowed({"ADMIN"}) // ඊට පස්සේ Admin ද කියලා බලනවා
    public Response deleteUser(@PathParam("id") int id) {
        userService.deleteUser(id);
        return Response.ok("{\"message\": \"User deleted\"}").build();
    }
}