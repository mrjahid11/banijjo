// this file is API layer with which the frontend speaks
package com.banijjo.Banjijjo.controller;
// this file will be used for adding, saving and deleting data. aka controlling data

import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.banijjo.Banjijjo.util.PasswordUtil;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // this class serves HTTP responses (JSON)
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000") // connecting the API layer with frontend's URL. Allow frontend port (3000) with backend port (8080)
public class UserController {
    @Autowired // annotation to inject data/wires with the repository.
    private UserRepository userRepository; // Now UserRepository can talk to the DB

    @PostMapping("/user") //to post data with a JSON body which allows to save the user in the DB
    User newUser(@RequestBody User newUser){
        // Hash password before saving (basic security)
        if (newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
            newUser.setPassword(PasswordUtil.hash(newUser.getPassword()));
        }
        return userRepository.save(newUser); // will save & return the data that we've just posted
    }

    @GetMapping("/users") // to get all the users from the url
    List<User> getAllUsers(){
        return userRepository.findAll(); // findAll() is the method from JPA
    }

    @GetMapping("/user/{id}") // Get request with parametres
    public User getUserById(@PathVariable Long id) {
        try { // error handling in JAVA
            return userRepository.findById(id) // telling the userRepository to find the data by the provided ID
                    .orElseThrow(() -> new Exception("User not found with id: " + id)); // if ID isn't valid or doesn't exist
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return null; // or you can return a default User object instead of null
        }
    }
}
