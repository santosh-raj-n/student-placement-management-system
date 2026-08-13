package com.placement.backend.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.placement.backend.model.Stat;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Placement Management System!";
    }
    @GetMapping("/stat")
    public Stat getStat() {
    return new Stat("500+", "Students Placed");
    }
}