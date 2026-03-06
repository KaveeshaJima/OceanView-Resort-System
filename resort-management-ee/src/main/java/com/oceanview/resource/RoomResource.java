package com.oceanview.resource;

import com.oceanview.dto.RoomRequestDTO;
import com.oceanview.dto.RoomResponseDTO;
import com.oceanview.service.RoomService;
import com.oceanview.utils.RolesAllowed;
import com.oceanview.utils.Secured;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import java.util.List;

@Path("/rooms")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RoomResource {

    private final RoomService service = new RoomService();

    @GET
    @Secured
    public Response getAllRooms() {
        List<RoomResponseDTO> rooms = service.getAllRooms();
        return Response.ok(rooms).build(); // 200 OK + Data
    }

    @POST
    @Secured
    @RolesAllowed({"ADMIN", "MANAGER"})
    public Response addRoom(RoomRequestDTO dto) {
        service.addRoom(dto);
        return Response.status(Response.Status.CREATED)
                .entity("Room " + dto.getRoomNo() + " created successfully")
                .build(); // 201 Created + Success Message
    }

    @PUT
    @Path("/{id}")
    @Secured
    @RolesAllowed({"ADMIN", "MANAGER"})
    public Response updateRoom(@PathParam("id") int id, RoomRequestDTO dto) {
        service.updateRoom(id, dto);
        return Response.ok("Room " + id + " updated successfully").build(); // 200 OK
    }

    @DELETE
    @Path("/{id}")
    @Secured
    @RolesAllowed({"ADMIN"})
    public Response deleteRoom(@PathParam("id") int id) {
        service.deleteRoom(id);
        return Response.ok("Room " + id + " deleted successfully").build(); // 200 OK
    }

    @POST
    @Path("/{id}/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Secured
    @RolesAllowed({"ADMIN", "MANAGER"})
    public Response uploadImage(@PathParam("id") int roomId, MultipartFormDataInput input) {
        // 1. File එක අරන් Server එකේ folder එකකට save කරන්න
        // 2. ඒ file name එක Database එකේ Room table එකේ update කරන්න
        // 3. සාර්ථක නම් 200 OK යවන්න
        return Response.ok("Image uploaded successfully").build();
    }
}