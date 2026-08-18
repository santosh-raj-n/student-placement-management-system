package com.placement.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.backend.model.Stat;

@Service
public class StatService {

    public List<Stat> getStats() {
        return List.of(
            new Stat("500+", "Students Placed"),
            new Stat("80+", "Companies"),
            new Stat("92%", "Placement Rate")
        );
    }
}