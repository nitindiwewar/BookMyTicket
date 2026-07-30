package com.movieticket.controller;

import com.movieticket.dto.ApiResponse;
import com.movieticket.entity.Theater;
import com.movieticket.service.TheaterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theaters")
public class TheaterController {

    private final TheaterService theaterService;

    public TheaterController(TheaterService theaterService) {
        this.theaterService = theaterService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Theater>>> getTheaters(@RequestParam(required = false) String city) {
        List<Theater> theaters = theaterService.getAllTheaters(city);
        return ResponseEntity.ok(ApiResponse.ok(theaters));
    }

    @GetMapping("/nearest")
    public ResponseEntity<ApiResponse<List<Theater>>> getNearestTheaters(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) String city
    ) {
        List<Theater> theaters = theaterService.getNearestTheaters(lat, lng, city);
        return ResponseEntity.ok(ApiResponse.ok(theaters));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Theater>> getTheaterById(@PathVariable String id) {
        Theater theater = theaterService.getTheaterById(id);
        return ResponseEntity.ok(ApiResponse.ok(theater));
    }

    @DeleteMapping("/clear-all")
    public ResponseEntity<ApiResponse<String>> clearAllTheaters() {
        theaterService.removeAllTheaters();
        return ResponseEntity.ok(ApiResponse.ok("All theater data removed successfully", "Cleared"));
    }
}
