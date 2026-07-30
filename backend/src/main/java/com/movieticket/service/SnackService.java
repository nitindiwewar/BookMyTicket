package com.movieticket.service;

import com.movieticket.entity.Snack;
import com.movieticket.exception.ResourceNotFoundException;
import com.movieticket.repository.SnackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SnackService {

    private final SnackRepository snackRepository;

    public SnackService(SnackRepository snackRepository) {
        this.snackRepository = snackRepository;
    }


    public List<Snack> getAllSnacks() {
        return snackRepository.findAll();
    }

    public Snack getSnackById(String id) {
        return snackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Snack not found with ID: " + id));
    }
}
