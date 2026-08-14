package com.placement.backend.service;

import org.springframework.stereotype.Service;

import com.placement.backend.model.Stat;

@Service
public class StatService {

    public Stat getStat() {
        return new Stat("500+", "Students Placed");
    }
}