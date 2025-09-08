package com.banijjo.Banjijjo.model;
// this file is where we will create all the models of our DB so that we can create the DB from Spring Boot backend
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity // This annotation basically tells Spring Boot to create a table in the DB for the following class
@Table(name = "users") // 'user' is reserved in some DBs (e.g., H2); use 'users' instead
public class User {
    @Id // this one is the primary key
    @GeneratedValue // this annotation helps tells the ID for Auto-Increment in the DB
    private Long id; // this is the primary key

    // Defining the columns of the table which is to be created
    public String name;
    public String username;
    private String email;
    @JsonIgnore
    private String password;
    private String type;
    private String role; // admin, broker, user, organisation

    // Getter and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
