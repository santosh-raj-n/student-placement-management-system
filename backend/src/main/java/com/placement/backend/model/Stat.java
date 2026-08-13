package com.placement.backend.model;

public class Stat {

    private String number;
    private String title;

    public Stat(String number, String title) {
        this.number = number;
        this.title = title;
    }

    public String getNumber() {
        return number;
    }

    public String getTitle() {
        return title;
    }
}