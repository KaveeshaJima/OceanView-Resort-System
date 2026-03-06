package com.oceanview.resource;

import com.oceanview.dto.GuestRequestDTO;
import com.oceanview.dto.GuestResponseDTO;
import com.oceanview.service.GuestService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/guests")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GuestResource {

    private final GuestService guestService = new GuestService();

    @POST
    public Response createGuest(GuestRequestDTO request) {
        GuestResponseDTO responseDTO = guestService.createGuest(request);
        return Response.status(Response.Status.CREATED).entity(responseDTO).build();
    }

    @GET
    public List<GuestResponseDTO> getAllGuests() {
        return guestService.getAllGuests();
    }

    @PUT
    @Path("/{id}")
    public Response updateGuest(@PathParam("id") Integer id, GuestRequestDTO request) {
        GuestResponseDTO updated = guestService.updateGuest(id, request);
        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteGuest(@PathParam("id") Integer id) {
        guestService.deleteGuest(id);
        return Response.ok("Guest deleted successfully").build();
    }
}