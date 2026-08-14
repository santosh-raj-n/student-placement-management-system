package com.placement.backend.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.placement.backend.model.Stat;
import com.placement.backend.service.StatService;

@RestController
@RequestMapping("/api")
public class HelloController {
    private final StatService statService;
    public HelloController(StatService statService) {
    this.statService = statService;
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Placement Management System!";
    }
    @GetMapping("/stat")
    public Stat getStat() {
    return statService.getStat();
    }
}