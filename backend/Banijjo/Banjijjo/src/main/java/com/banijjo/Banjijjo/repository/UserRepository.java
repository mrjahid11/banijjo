// This is the Data Access Layer (DAL). It gives us access to interact with the DB without writing the SQL

package com.banijjo.Banjijjo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.banijjo.Banjijjo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // JpaRepository<name of the model that needs to be imported, data type of the
    // primary key>
    // if you need to know that which methods you can use for ORM using JPA
    // Repository then ctrl + click on it

    Optional<User> findByEmail(String email);
}
//    JpaRepository<User, Long> means:
//    User = the model/table.
//    Long = data type of the primary key.

// This automatically gives you methods like:
// save(user) → Insert/Update into DB
// findAll() → Get all users
// findById(id) → Get a user by ID
// deleteById(id) → Delete by ID
// In short: UserRepository = ready-made SQL operations.