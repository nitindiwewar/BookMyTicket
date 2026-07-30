package com.movieticket.controller;

import com.movieticket.dto.ApiResponse;
import com.movieticket.entity.Snack;
import com.movieticket.service.SnackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/snacks")
public class SnackController {

    private final SnackService snackService;

    public SnackController(SnackService snackService) {
        this.snackService = snackService;
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<Snack>>> getSnacks() {
        List<Snack> snacks = snackService.getAllSnacks();
        return ResponseEntity.ok(ApiResponse.ok(snacks));
    }
}
