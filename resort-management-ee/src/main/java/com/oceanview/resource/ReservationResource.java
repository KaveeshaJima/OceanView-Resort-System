package com.oceanview.resource;

import com.oceanview.dto.ReservationRequestDTO;
import com.oceanview.dto.ReservationResponseDTO;
import com.oceanview.service.ReservationService;
import com.oceanview.utils.Secured;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/reservations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReservationResource {

    private final ReservationService service = new ReservationService();

    @POST
    public Response makeReservation(ReservationRequestDTO request) {
        try {
            ReservationResponseDTO responseDTO = service.createReservation(request);
            return Response.status(Response.Status.CREATED)
                    .entity(responseDTO)
                    .build();
        } catch (RuntimeException e) {
            // Error එක JSON එකක් විදිහට යවමු
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    @GET
    @Path("/{id}/invoice")
    @Produces("application/pdf")
    public Response downloadInvoice(@PathParam("id") Integer id) {
        byte[] pdfBytes = service.generateInvoicePDF(id);

        return Response.ok(pdfBytes)
                .header("Content-Disposition", "attachment; filename=Invoice_RES" + id + ".pdf")
                .build();
    }

    @GET
    @Secured
    public Response getAllReservations() {
        return Response.ok(service.getAllReservations()).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateReservation(@PathParam("id") Integer id, ReservationRequestDTO request) {
        try {
            ReservationResponseDTO updated = service.updateReservation(id, request);
            return Response.ok(updated).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response cancelReservation(@PathParam("id") Integer id) {
        try {
            String msg = service.cancelReservation(id);
            return Response.ok("{\"message\": \"" + msg + "\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}